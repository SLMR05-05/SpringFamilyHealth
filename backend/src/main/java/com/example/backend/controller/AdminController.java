package com.example.backend.controller;

import com.example.backend.dto.admin.AdminCreateRequest;
import com.example.backend.dto.admin.AdminUpdateRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.AdminResponse;
import com.example.backend.entity.Admin;
import com.example.backend.service.AdminService;
import com.example.backend.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin
public class AdminController {
    private final AdminService service;
    private final UserService userService;

    public AdminController(AdminService service, UserService userService) {
        this.service = service;
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ApiResponse<Page<AdminResponse>> getAll(Pageable pageable) {
        return ApiResponse.<Page<AdminResponse>>builder()
                .result(service.findAll(pageable).map(this::toResponse))
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ApiResponse<AdminResponse> getById(@PathVariable Integer id) {
        return ApiResponse.<AdminResponse>builder()
                .result(toResponse(service.findById(id)))
                .build();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<AdminResponse> create(@RequestBody @jakarta.validation.Valid AdminCreateRequest request) {
        Admin entity = new Admin();
        entity.setUser(userService.findById(request.getUserId()));
        Admin created = service.create(entity);
        return ApiResponse.<AdminResponse>builder()
                .result(toResponse(created))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<AdminResponse> update(@PathVariable Integer id, @RequestBody @jakarta.validation.Valid AdminUpdateRequest request) {
        Admin payload = new Admin();
        payload.setUser(userService.findById(request.getUserId()));
        return ApiResponse.<AdminResponse>builder()
                .result(toResponse(service.update(id, payload)))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ApiResponse.<Void>builder().build();
    }

    @GetMapping("/dashboard/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<java.util.Map<String, Object>> getDashboardStatistics() {
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        
        // Count users, doctors, appointments
        long totalUsers = userService.countAll();
        long totalDoctors = userService.countByRole("DOCTOR");
        long totalPatients = userService.countByRole("USER");
        
        stats.put("totalUsers", totalUsers);
        stats.put("totalDoctors", totalDoctors);
        stats.put("totalPatients", totalPatients);
        
        return ApiResponse.<java.util.Map<String, Object>>builder()
                .result(stats)
                .build();
    }

    private AdminResponse toResponse(Admin a) {
        AdminResponse res = new AdminResponse();
        res.setAdminId(a.getAdminId());
        res.setUserId(a.getUser() != null ? a.getUser().getUserId() : null);
        return res;
    }
}
