package com.example.backend.controller;

import com.example.backend.dto.family.FamilyCreateRequest;
import com.example.backend.dto.family.FamilyUpdateRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.FamilyResponse;
import com.example.backend.entity.Family;
import com.example.backend.service.DoctorService;
import com.example.backend.service.FamilyService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/families")
@CrossOrigin
public class FamilyController {
    private final FamilyService service;
    private final DoctorService doctorService;
    public FamilyController(FamilyService service, DoctorService doctorService) {
        this.service = service;
        this.doctorService = doctorService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ApiResponse<Page<FamilyResponse>> getAll(Pageable pageable) {
        return ApiResponse.<Page<FamilyResponse>>builder()
                .result(service.findAll(pageable).map(this::toResponse))
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ApiResponse<FamilyResponse> getById(@PathVariable Integer id) {
        return ApiResponse.<FamilyResponse>builder()
                .result(toResponse(service.findById(id)))
                .build();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<FamilyResponse> create(@Valid @RequestBody FamilyCreateRequest req) {
        Family entity = new Family();
        entity.setDoctor(doctorService.findById(req.getDoctorId()));
        entity.setAddress(req.getAddress());
        entity.setContactNumber(req.getContactNumber());
        Family created = service.create(entity);
        return ApiResponse.<FamilyResponse>builder()
                .result(toResponse(created))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<FamilyResponse> update(@PathVariable Integer id, @Valid @RequestBody FamilyUpdateRequest req) {
        Family payload = new Family();
        payload.setDoctor(doctorService.findById(req.getDoctorId()));
        payload.setAddress(req.getAddress());
        payload.setContactNumber(req.getContactNumber());
        return ApiResponse.<FamilyResponse>builder()
                .result(toResponse(service.update(id, payload)))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ApiResponse.<Void>builder().build();
    }

    private FamilyResponse toResponse(Family f) {
        FamilyResponse res = new FamilyResponse();
        res.setFamilyId(f.getFamilyId());
        res.setDoctorId(f.getDoctor() != null ? f.getDoctor().getDoctorId() : null);
        res.setAddress(f.getAddress());
        res.setContactNumber(f.getContactNumber());
        return res;
    }
}
