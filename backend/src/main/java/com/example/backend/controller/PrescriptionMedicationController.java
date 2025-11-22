package com.example.backend.controller;

import com.example.backend.dto.prescriptionmedication.PrescriptionMedicationCreateRequest;
import com.example.backend.dto.prescriptionmedication.PrescriptionMedicationUpdateRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.PrescriptionMedicationResponse;
import com.example.backend.entity.PrescriptionMedication;
import com.example.backend.entity.PrescriptionMedicationId;
import com.example.backend.service.MedicationService;
import com.example.backend.service.PrescriptionMedicationService;
import com.example.backend.service.PrescriptionService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/prescription-medications")
@CrossOrigin
public class PrescriptionMedicationController {
    private final PrescriptionMedicationService service;
    private final PrescriptionService prescriptionService;
    private final MedicationService medicationService;
    public PrescriptionMedicationController(PrescriptionMedicationService service, PrescriptionService prescriptionService, MedicationService medicationService) {
        this.service = service;
        this.prescriptionService = prescriptionService;
        this.medicationService = medicationService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ApiResponse<Page<PrescriptionMedicationResponse>> getAll(Pageable pageable) {
        return ApiResponse.<Page<PrescriptionMedicationResponse>>builder()
                .result(service.findAll(pageable).map(this::toResponse))
                .build();
    }

    @GetMapping("/{prescriptionId}/{medicationId}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ApiResponse<PrescriptionMedicationResponse> getById(@PathVariable Integer prescriptionId, @PathVariable Integer medicationId) {
        return ApiResponse.<PrescriptionMedicationResponse>builder()
                .result(toResponse(service.findById(new PrescriptionMedicationId(prescriptionId, medicationId))))
                .build();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PrescriptionMedicationResponse> create(@Valid @RequestBody PrescriptionMedicationCreateRequest req) {
        PrescriptionMedication entity = new PrescriptionMedication();
        entity.setPrescription(prescriptionService.findById(req.getPrescriptionId()));
        entity.setMedication(medicationService.findById(req.getMedicationId()));
        entity.setDosage(req.getDosage());
        entity.setDuration(req.getDuration());
        entity.setId(new PrescriptionMedicationId(req.getPrescriptionId(), req.getMedicationId()));
        PrescriptionMedication created = service.create(entity);
        return ApiResponse.<PrescriptionMedicationResponse>builder()
                .result(toResponse(created))
                .build();
    }

    @PutMapping("/{prescriptionId}/{medicationId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PrescriptionMedicationResponse> update(@PathVariable Integer prescriptionId, @PathVariable Integer medicationId, @Valid @RequestBody PrescriptionMedicationUpdateRequest req) {
        PrescriptionMedication payload = new PrescriptionMedication();
        payload.setPrescription(prescriptionService.findById(prescriptionId));
        payload.setMedication(medicationService.findById(medicationId));
        payload.setDosage(req.getDosage());
        payload.setDuration(req.getDuration());
        PrescriptionMedication updated = service.update(new PrescriptionMedicationId(prescriptionId, medicationId), payload);
        return ApiResponse.<PrescriptionMedicationResponse>builder()
                .result(toResponse(updated))
                .build();
    }

    @DeleteMapping("/{prescriptionId}/{medicationId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Integer prescriptionId, @PathVariable Integer medicationId) {
        service.delete(new PrescriptionMedicationId(prescriptionId, medicationId));
        return ApiResponse.<Void>builder().build();
    }

    private PrescriptionMedicationResponse toResponse(PrescriptionMedication pm) {
        PrescriptionMedicationResponse res = new PrescriptionMedicationResponse();
        PrescriptionMedicationId id = pm.getId();
        res.setPrescriptionId(id != null ? id.getPrescriptionId() : (pm.getPrescription() != null ? pm.getPrescription().getPrescriptionId() : null));
        res.setMedicationId(id != null ? id.getMedicationId() : (pm.getMedication() != null ? pm.getMedication().getMedicationId() : null));
        res.setDosage(pm.getDosage());
        res.setDuration(pm.getDuration());
        return res;
    }
}
