package com.example.backend.controller;

import com.example.backend.dto.doctorrequest.DoctorRequestCreateDTO;
import com.example.backend.dto.doctorrequest.DoctorRequestDTO;
import com.example.backend.dto.doctorrequest.DoctorRequestResponseDTO;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.service.DoctorRequestService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doctor-requests")
@CrossOrigin
public class DoctorRequestController {

    private final DoctorRequestService doctorRequestService;

    public DoctorRequestController(DoctorRequestService doctorRequestService) {
        this.doctorRequestService = doctorRequestService;
    }

    // User sends a request to a doctor
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<DoctorRequestDTO>> createRequest(@RequestBody DoctorRequestCreateDTO dto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        // Extract userId from JWT token claims
        Integer userId = null;
        if (auth.getPrincipal() instanceof org.springframework.security.oauth2.jwt.Jwt) {
            org.springframework.security.oauth2.jwt.Jwt jwt = (org.springframework.security.oauth2.jwt.Jwt) auth.getPrincipal();
            Object userIdClaim = jwt.getClaim("userId");
            
            // Handle both Long and Integer types from JWT claims
            if (userIdClaim instanceof Long) {
                userId = ((Long) userIdClaim).intValue();
            } else if (userIdClaim instanceof Integer) {
                userId = (Integer) userIdClaim;
            } else if (userIdClaim instanceof Number) {
                userId = ((Number) userIdClaim).intValue();
            }
        }
        
        if (userId == null) {
            throw new IllegalArgumentException("User ID not found in token");
        }

        DoctorRequestDTO result = doctorRequestService.createRequest(userId, dto);
        ApiResponse<DoctorRequestDTO> response = new ApiResponse<>();
        response.setResult(result);
        response.setMessage("Request sent successfully");
        return ResponseEntity.ok(response);
    }

    // Doctor views requests sent to them
    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<Page<DoctorRequestDTO>>> getRequestsForDoctor(
            @PathVariable Integer doctorId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<DoctorRequestDTO> requests = doctorRequestService.getRequestsForDoctor(doctorId, status, page, size);
        
        ApiResponse<Page<DoctorRequestDTO>> response = new ApiResponse<>();
        response.setResult(requests);
        response.setMessage("Requests retrieved successfully");
        return ResponseEntity.ok(response);
    }

    // Doctor responds to a request
    @PutMapping("/{requestId}/respond")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<DoctorRequestDTO>> respondToRequest(
            @PathVariable Integer requestId,
            @RequestParam Integer doctorId,
            @RequestBody DoctorRequestResponseDTO responseDTO) {
        
        DoctorRequestDTO result = doctorRequestService.respondToRequest(requestId, doctorId, responseDTO);
        
        ApiResponse<DoctorRequestDTO> response = new ApiResponse<>();
        response.setResult(result);
        response.setMessage("Response sent successfully");
        return ResponseEntity.ok(response);
    }

    // Get pending request count for a doctor
    @GetMapping("/doctor/{doctorId}/pending-count")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<Long>> getPendingCount(@PathVariable Integer doctorId) {
        long count = doctorRequestService.countPendingRequests(doctorId);
        
        ApiResponse<Long> response = new ApiResponse<>();
        response.setResult(count);
        response.setMessage("Pending requests count retrieved");
        return ResponseEntity.ok(response);
    }
}
