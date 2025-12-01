package com.example.backend.controller;

import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.VisitHistoryResponse;
import com.example.backend.dto.visithistory.VisitHistoryCreateRequest;
import com.example.backend.dto.visithistory.VisitHistoryUpdateRequest;
import com.example.backend.entity.VisitHistory;
import com.example.backend.service.MemberService;
import com.example.backend.service.VisitHistoryService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/visit-histories")
@CrossOrigin
public class VisitHistoryController {
    private final VisitHistoryService service;
    private final MemberService memberService;
    public VisitHistoryController(VisitHistoryService service, MemberService memberService) {
        this.service = service;
        this.memberService = memberService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER','DOCTOR')")
    public ApiResponse<Page<VisitHistoryResponse>> getAll(Pageable pageable) {
        return ApiResponse.<Page<VisitHistoryResponse>>builder()
                .result(service.findAll(pageable).map(this::toResponse))
                .build();
    }

    @GetMapping("/member/{memberId}")
    @PreAuthorize("hasAnyRole('ADMIN','USER','DOCTOR')")
    public ApiResponse<java.util.List<VisitHistoryResponse>> getByMemberId(@PathVariable Integer memberId) {
        java.util.List<VisitHistoryResponse> list = service.findByMemberId(memberId).stream().map(this::toResponse).toList();
        return ApiResponse.<java.util.List<VisitHistoryResponse>>builder().result(list).build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER','DOCTOR')")
    public ApiResponse<VisitHistoryResponse> getById(@PathVariable Integer id) {
        return ApiResponse.<VisitHistoryResponse>builder()
                .result(toResponse(service.findById(id)))
                .build();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    public ApiResponse<VisitHistoryResponse> create(@Valid @RequestBody VisitHistoryCreateRequest req) {
        VisitHistory entity = new VisitHistory();
        entity.setMember(memberService.findById(req.getMemberId()));
        entity.setVisitDate(req.getVisitDate());
        entity.setReason(req.getReason());
        entity.setDiagnosis(req.getDiagnosis());
        entity.setFollowUpDate(req.getFollowUpDate());
        VisitHistory created = service.create(entity);
        return ApiResponse.<VisitHistoryResponse>builder()
                .result(toResponse(created))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    public ApiResponse<VisitHistoryResponse> update(@PathVariable Integer id, @Valid @RequestBody VisitHistoryUpdateRequest req) {
        VisitHistory payload = new VisitHistory();
        payload.setMember(memberService.findById(req.getMemberId()));
        payload.setVisitDate(req.getVisitDate());
        payload.setReason(req.getReason());
        payload.setDiagnosis(req.getDiagnosis());
        payload.setFollowUpDate(req.getFollowUpDate());
        return ApiResponse.<VisitHistoryResponse>builder()
                .result(toResponse(service.update(id, payload)))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ApiResponse.<Void>builder().build();
    }

    private VisitHistoryResponse toResponse(VisitHistory v) {
        VisitHistoryResponse res = new VisitHistoryResponse();
        res.setVisitId(v.getVisitId());
        res.setMemberId(v.getMember() != null ? v.getMember().getMemberId() : null);
        res.setVisitDate(v.getVisitDate());
        res.setReason(v.getReason());
        res.setDiagnosis(v.getDiagnosis());
        res.setFollowUpDate(v.getFollowUpDate());
        return res;
    }
}
