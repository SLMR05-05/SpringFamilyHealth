package com.example.backend.controller;

import com.example.backend.dto.invitecode.InviteCodeCreateRequest;
import com.example.backend.dto.invitecode.InviteCodeUpdateRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.InviteCodeResponse;
import com.example.backend.entity.InviteCode;
import com.example.backend.service.FamilyService;
import com.example.backend.service.InviteCodeService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invite-codes")
@CrossOrigin
public class InviteCodeController {
    private final InviteCodeService service;
    private final FamilyService familyService;
    public InviteCodeController(InviteCodeService service, FamilyService familyService) {
        this.service = service;
        this.familyService = familyService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ApiResponse<Page<InviteCodeResponse>> getAll(Pageable pageable) {
        return ApiResponse.<Page<InviteCodeResponse>>builder()
                .result(service.findAll(pageable).map(this::toResponse))
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ApiResponse<InviteCodeResponse> getById(@PathVariable Integer id) {
        return ApiResponse.<InviteCodeResponse>builder()
                .result(toResponse(service.findById(id)))
                .build();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<InviteCodeResponse> create(@Valid @RequestBody InviteCodeCreateRequest req) {
        InviteCode entity = new InviteCode();
        entity.setFamily(familyService.findById(req.getFamilyId()));
        entity.setCode(req.getCode());
        entity.setCreatedAt(req.getCreatedAt());
        entity.setExpiredAt(req.getExpiredAt());
        InviteCode created = service.create(entity);
        return ApiResponse.<InviteCodeResponse>builder()
                .result(toResponse(created))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<InviteCodeResponse> update(@PathVariable Integer id, @Valid @RequestBody InviteCodeUpdateRequest req) {
        InviteCode payload = new InviteCode();
        payload.setFamily(familyService.findById(req.getFamilyId()));
        payload.setCode(req.getCode());
        payload.setCreatedAt(req.getCreatedAt());
        payload.setExpiredAt(req.getExpiredAt());
        return ApiResponse.<InviteCodeResponse>builder()
                .result(toResponse(service.update(id, payload)))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ApiResponse.<Void>builder().build();
    }

    private InviteCodeResponse toResponse(InviteCode i) {
        InviteCodeResponse res = new InviteCodeResponse();
        res.setInviteId(i.getInviteId());
        res.setFamilyId(i.getFamily() != null ? i.getFamily().getFamilyId() : null);
        res.setCode(i.getCode());
        res.setCreatedAt(i.getCreatedAt());
        res.setExpiredAt(i.getExpiredAt());
        return res;
    }
}
