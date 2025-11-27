package com.example.backend.controller;

import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.VaccinationResponse;
import com.example.backend.dto.vaccination.VaccinationCreateRequest;
import com.example.backend.dto.vaccination.VaccinationUpdateRequest;
import com.example.backend.entity.Vaccination;
import com.example.backend.service.MemberService;
import com.example.backend.service.VaccinationService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vaccinations")
@CrossOrigin
public class VaccinationController {
    private final VaccinationService service;
    private final MemberService memberService;
    public VaccinationController(VaccinationService service, MemberService memberService) {
        this.service = service;
        this.memberService = memberService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ApiResponse<Page<VaccinationResponse>> getAll(Pageable pageable) {
        return ApiResponse.<Page<VaccinationResponse>>builder()
                .result(service.findAll(pageable).map(this::toResponse))
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ApiResponse<VaccinationResponse> getById(@PathVariable Integer id) {
        return ApiResponse.<VaccinationResponse>builder()
                .result(toResponse(service.findById(id)))
                .build();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<VaccinationResponse> create(@Valid @RequestBody VaccinationCreateRequest req) {
        Vaccination entity = new Vaccination();
        entity.setMember(memberService.findById(req.getMemberId()));
        entity.setVaccineName(req.getVaccineName());
        entity.setDateGiven(req.getDateGiven());
        Vaccination created = service.create(entity);
        return ApiResponse.<VaccinationResponse>builder()
                .result(toResponse(created))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<VaccinationResponse> update(@PathVariable Integer id, @Valid @RequestBody VaccinationUpdateRequest req) {
        Vaccination payload = new Vaccination();
        payload.setMember(memberService.findById(req.getMemberId()));
        payload.setVaccineName(req.getVaccineName());
        payload.setDateGiven(req.getDateGiven());
        return ApiResponse.<VaccinationResponse>builder()
                .result(toResponse(service.update(id, payload)))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ApiResponse.<Void>builder().build();
    }

    private VaccinationResponse toResponse(Vaccination v) {
        VaccinationResponse res = new VaccinationResponse();
        res.setVaccineId(v.getVaccineId());
        res.setMemberId(v.getMember() != null ? v.getMember().getMemberId() : null);
        res.setVaccineName(v.getVaccineName());
        res.setDateGiven(v.getDateGiven());
        return res;
    }
}
