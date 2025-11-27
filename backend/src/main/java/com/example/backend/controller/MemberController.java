package com.example.backend.controller;

import com.example.backend.dto.member.MemberCreateRequest;
import com.example.backend.dto.member.MemberUpdateRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.MemberResponse;
import com.example.backend.entity.Member;
import com.example.backend.service.FamilyService;
import com.example.backend.service.MemberService;
import com.example.backend.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/members")
@CrossOrigin
public class MemberController {
    private final MemberService service;
    private final UserService userService;
    private final FamilyService familyService;

    public MemberController(MemberService service, UserService userService, FamilyService familyService) {
        this.service = service;
        this.userService = userService;
        this.familyService = familyService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ApiResponse<Page<MemberResponse>> getAll(Pageable pageable) {
        return ApiResponse.<Page<MemberResponse>>builder()
                .result(service.findAll(pageable).map(this::toResponse))
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ApiResponse<MemberResponse> getById(@PathVariable Integer id) {
        return ApiResponse.<MemberResponse>builder()
                .result(toResponse(service.findById(id)))
                .build();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<MemberResponse> create(@RequestBody @jakarta.validation.Valid MemberCreateRequest request) {
        Member entity = new Member();
        entity.setUser(userService.findById(request.getUserId()));
        entity.setFamily(familyService.findById(request.getFamilyId()));
        entity.setAge(request.getAge());
        entity.setDayOfBirth(request.getDayOfBirth());
        entity.setGender(request.getGender());
        entity.setWeight(request.getWeight());
        entity.setHeight(request.getHeight());
        entity.setRelationship(request.getRelationship());
        entity.setRoleInFamily(request.getRoleInFamily());
        Member created = service.create(entity);
        return ApiResponse.<MemberResponse>builder()
                .result(toResponse(created))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<MemberResponse> update(@PathVariable Integer id, @RequestBody @jakarta.validation.Valid MemberUpdateRequest request) {
        Member payload = new Member();
        payload.setUser(userService.findById(request.getUserId()));
        payload.setFamily(familyService.findById(request.getFamilyId()));
        payload.setAge(request.getAge());
        payload.setDayOfBirth(request.getDayOfBirth());
        payload.setGender(request.getGender());
        payload.setWeight(request.getWeight());
        payload.setHeight(request.getHeight());
        payload.setRelationship(request.getRelationship());
        payload.setRoleInFamily(request.getRoleInFamily());
        payload.setPhone(request.getPhone());
        payload.setEmail(request.getEmail());
        payload.setAddress(request.getAddress());
        return ApiResponse.<MemberResponse>builder()
                .result(toResponse(service.update(id, payload)))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ApiResponse.<Void>builder().build();
    }

    private MemberResponse toResponse(Member m) {
        MemberResponse res = new MemberResponse();
        res.setMemberId(m.getMemberId());
        res.setUserId(m.getUser() != null ? m.getUser().getUserId() : null);
        res.setFamilyId(m.getFamily() != null ? m.getFamily().getFamilyId() : null);
        res.setAge(m.getAge());
        res.setDayOfBirth(m.getDayOfBirth());
        res.setGender(m.getGender());
        res.setWeight(m.getWeight());
        res.setHeight(m.getHeight());
        res.setRelationship(m.getRelationship());
        res.setRoleInFamily(m.getRoleInFamily());
        res.setPhone(m.getPhone());
        res.setEmail(m.getEmail());
        res.setAddress(m.getAddress());
        if (m.getUser() != null) {
            res.setName(m.getUser().getName());
        }
        return res;
    }
}
