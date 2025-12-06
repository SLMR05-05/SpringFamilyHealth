package com.example.backend.controller;

import com.example.backend.dto.healthrecord.HealthRecordCreateRequest;
import com.example.backend.dto.healthrecord.HealthRecordCreateForMeRequest;
import com.example.backend.dto.healthrecord.HealthRecordUpdateRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.HealthRecordResponse;
import com.example.backend.entity.HealthRecord;
import com.example.backend.service.HealthRecordService;
import com.example.backend.service.MemberService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/health-records")
@CrossOrigin
public class HealthRecordController {
    private final HealthRecordService service;
    private final MemberService memberService;
    public HealthRecordController(HealthRecordService service, MemberService memberService) { this.service = service; this.memberService = memberService; }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER','DOCTOR')")
    public ApiResponse<Page<HealthRecordResponse>> getAll(Pageable pageable) {
        return ApiResponse.<Page<HealthRecordResponse>>builder()
                .result(service.findAll(pageable).map(this::toResponse))
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER','DOCTOR')")
    public ApiResponse<HealthRecordResponse> getById(@PathVariable Integer id) {
        return ApiResponse.<HealthRecordResponse>builder()
                .result(toResponse(service.findById(id)))
                .build();
    }

    @GetMapping("/member/{memberId}")
    @PreAuthorize("hasAnyRole('ADMIN','USER','DOCTOR')")
    public ApiResponse<HealthRecordResponse> getByMemberId(@PathVariable Integer memberId) {
        try {
            HealthRecord hr = service.findByMemberId(memberId);
            return ApiResponse.<HealthRecordResponse>builder()
                    .result(toResponse(hr))
                    .build();
        } catch (com.example.backend.service.NotFoundException ex) {
            // Return success with null result so frontend can treat as "no record"
            return ApiResponse.<HealthRecordResponse>builder().result(null).build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<HealthRecordResponse> create(@RequestBody @jakarta.validation.Valid HealthRecordCreateRequest request) {
        HealthRecord entity = new HealthRecord();
        entity.setMember(memberService.findById(request.getMemberId()));
        entity.setBloodType(request.getBloodType());
        entity.setAllergies(request.getAllergies());
        entity.setChronicConditions(request.getChronicConditions());
        HealthRecord created = service.create(entity);
        return ApiResponse.<HealthRecordResponse>builder()
                .result(toResponse(created))
                .build();
    }

    @PostMapping("/me")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ApiResponse<HealthRecordResponse> createForMe(
            @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.oauth2.jwt.Jwt jwt,
            @RequestBody @jakarta.validation.Valid HealthRecordCreateForMeRequest request) {
        Object userIdClaim = jwt.getClaim("userId");
        if (userIdClaim == null) {
            throw new RuntimeException("UserId not found in token");
        }
        Integer userId = ((Number) userIdClaim).intValue();

        // Find member for this user
        com.example.backend.entity.Member member = memberService.findByUserId(userId);

        HealthRecord entity = new HealthRecord();
        entity.setMember(member);
        entity.setBloodType(request.getBloodType());
        entity.setAllergies(request.getAllergies());
        entity.setChronicConditions(request.getChronicConditions());
        HealthRecord created = service.create(entity);
        return ApiResponse.<HealthRecordResponse>builder()
                .result(toResponse(created))
                .build();
    }

    @PutMapping("/me")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ApiResponse<HealthRecordResponse> updateForMe(
            @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.oauth2.jwt.Jwt jwt,
            @RequestBody @jakarta.validation.Valid HealthRecordCreateForMeRequest request) {
        Object userIdClaim = jwt.getClaim("userId");
        if (userIdClaim == null) {
            throw new RuntimeException("UserId not found in token");
        }
        Integer userId = ((Number) userIdClaim).intValue();

        // Find member for this user
        com.example.backend.entity.Member member = memberService.findByUserId(userId);

        HealthRecord payload = new HealthRecord();
        payload.setBloodType(request.getBloodType());
        payload.setAllergies(request.getAllergies());
        payload.setChronicConditions(request.getChronicConditions());
        
        HealthRecord updated = service.updateByMemberId(member.getMemberId(), payload);
        return ApiResponse.<HealthRecordResponse>builder()
                .result(toResponse(updated))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<HealthRecordResponse> update(@PathVariable Integer id, @RequestBody @jakarta.validation.Valid HealthRecordUpdateRequest request) {
        HealthRecord payload = new HealthRecord();
        payload.setMember(memberService.findById(request.getMemberId()));
        payload.setBloodType(request.getBloodType());
        payload.setAllergies(request.getAllergies());
        payload.setChronicConditions(request.getChronicConditions());
        return ApiResponse.<HealthRecordResponse>builder()
                .result(toResponse(service.update(id, payload)))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ApiResponse.<Void>builder().build();
    }

    private HealthRecordResponse toResponse(HealthRecord hr) {
        HealthRecordResponse res = new HealthRecordResponse();
        res.setRecordId(hr.getRecordId());
        res.setMemberId(hr.getMember() != null ? hr.getMember().getMemberId() : null);
        res.setBloodType(hr.getBloodType());
        res.setAllergies(hr.getAllergies());
        res.setChronicConditions(hr.getChronicConditions());
        return res;
    }
}
