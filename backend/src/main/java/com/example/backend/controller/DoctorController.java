package com.example.backend.controller;

import com.example.backend.dto.doctor.DoctorCreateRequest;
import com.example.backend.dto.doctor.DoctorUpdateRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.DoctorResponse;
import com.example.backend.entity.Doctor;
import com.example.backend.service.DoctorService;
import com.example.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin
public class DoctorController {
    private final DoctorService service;
    private final UserService userService;
    public DoctorController(DoctorService service, UserService userService) {
        this.service = service;
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ApiResponse<Page<DoctorResponse>> getAll(Pageable pageable) {
        return ApiResponse.<Page<DoctorResponse>>builder()
                .result(service.findAll(pageable).map(this::toResponse))
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ApiResponse<DoctorResponse> getById(@PathVariable Integer id) {
        return ApiResponse.<DoctorResponse>builder()
                .result(toResponse(service.findById(id)))
                .build();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<DoctorResponse> create(@Valid @RequestBody DoctorCreateRequest req) {
        Doctor entity = new Doctor();
        entity.setUser(userService.findById(req.getUserId()));
        entity.setCertificateNumber(req.getCertificateNumber());
        entity.setDescription(req.getDescription());
        Doctor created = service.create(entity);
        return ApiResponse.<DoctorResponse>builder()
                .result(toResponse(created))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<DoctorResponse> update(@PathVariable Integer id, @Valid @RequestBody DoctorUpdateRequest req) {
        Doctor payload = new Doctor();
        payload.setUser(userService.findById(req.getUserId()));
        payload.setCertificateNumber(req.getCertificateNumber());
        payload.setDescription(req.getDescription());
        return ApiResponse.<DoctorResponse>builder()
                .result(toResponse(service.update(id, payload)))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ApiResponse.<Void>builder().build();
    }

    private DoctorResponse toResponse(Doctor d) {
        DoctorResponse res = new DoctorResponse();
        res.setDoctorId(d.getDoctorId());
        res.setUserId(d.getUser() != null ? d.getUser().getUserId() : null);
        res.setCertificateNumber(d.getCertificateNumber());
        res.setDescription(d.getDescription());
        return res;
    }
}
