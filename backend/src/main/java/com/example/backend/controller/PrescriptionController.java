package com.example.backend.controller;

import com.example.backend.dto.prescription.PrescriptionCreateRequest;
import com.example.backend.dto.prescription.PrescriptionUpdateRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.PrescriptionResponse;
import com.example.backend.entity.Prescription;
import com.example.backend.service.MemberService;
import com.example.backend.service.PrescriptionService;
import com.example.backend.service.VisitHistoryService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin
public class PrescriptionController {
    private final PrescriptionService service;
    private final MemberService memberService;
    private final VisitHistoryService visitHistoryService;
    public PrescriptionController(PrescriptionService service, MemberService memberService, VisitHistoryService visitHistoryService) {
        this.service = service;
        this.memberService = memberService;
        this.visitHistoryService = visitHistoryService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ApiResponse<Page<PrescriptionResponse>> getAll(Pageable pageable) {
        return ApiResponse.<Page<PrescriptionResponse>>builder()
                .result(service.findAll(pageable).map(this::toResponse))
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ApiResponse<PrescriptionResponse> getById(@PathVariable Integer id) {
        return ApiResponse.<PrescriptionResponse>builder()
                .result(toResponse(service.findById(id)))
                .build();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PrescriptionResponse> create(@Valid @RequestBody PrescriptionCreateRequest req) {
        Prescription entity = new Prescription();
        entity.setMember(memberService.findById(req.getMemberId()));
        entity.setVisit(visitHistoryService.findById(req.getVisitId()));
        entity.setNote(req.getNote());
        Prescription created = service.create(entity);
        return ApiResponse.<PrescriptionResponse>builder()
                .result(toResponse(created))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PrescriptionResponse> update(@PathVariable Integer id, @Valid @RequestBody PrescriptionUpdateRequest req) {
        Prescription payload = new Prescription();
        payload.setMember(memberService.findById(req.getMemberId()));
        payload.setVisit(visitHistoryService.findById(req.getVisitId()));
        payload.setNote(req.getNote());
        return ApiResponse.<PrescriptionResponse>builder()
                .result(toResponse(service.update(id, payload)))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ApiResponse.<Void>builder().build();
    }

    private PrescriptionResponse toResponse(Prescription p) {
        PrescriptionResponse res = new PrescriptionResponse();
        res.setPrescriptionId(p.getPrescriptionId());
        res.setMemberId(p.getMember() != null ? p.getMember().getMemberId() : null);
        res.setVisitId(p.getVisit() != null ? p.getVisit().getVisitId() : null);
        res.setNote(p.getNote());
        return res;
    }
}
