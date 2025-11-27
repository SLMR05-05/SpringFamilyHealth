package com.example.backend.controller;

import com.example.backend.dto.medication.MedicationCreateRequest;
import com.example.backend.dto.medication.MedicationUpdateRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.MedicationResponse;
import com.example.backend.entity.Medication;
import com.example.backend.service.MedicationService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/medications")
@CrossOrigin
public class MedicationController {
    private final MedicationService service;
    public MedicationController(MedicationService service) { this.service = service; }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ApiResponse<Page<MedicationResponse>> getAll(Pageable pageable) {
        return ApiResponse.<Page<MedicationResponse>>builder()
                .result(service.findAll(pageable).map(this::toResponse))
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ApiResponse<MedicationResponse> getById(@PathVariable Integer id) {
        return ApiResponse.<MedicationResponse>builder()
                .result(toResponse(service.findById(id)))
                .build();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<MedicationResponse> create(@Valid @RequestBody MedicationCreateRequest req) {
        Medication entity = new Medication();
        entity.setMedicationName(req.getMedicationName());
        Medication created = service.create(entity);
        return ApiResponse.<MedicationResponse>builder()
                .result(toResponse(created))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<MedicationResponse> update(@PathVariable Integer id, @Valid @RequestBody MedicationUpdateRequest req) {
        Medication payload = new Medication();
        payload.setMedicationName(req.getMedicationName());
        return ApiResponse.<MedicationResponse>builder()
                .result(toResponse(service.update(id, payload)))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ApiResponse.<Void>builder().build();
    }

    private MedicationResponse toResponse(Medication m) {
        MedicationResponse res = new MedicationResponse();
        res.setMedicationId(m.getMedicationId());
        res.setMedicationName(m.getMedicationName());
        return res;
    }
}
