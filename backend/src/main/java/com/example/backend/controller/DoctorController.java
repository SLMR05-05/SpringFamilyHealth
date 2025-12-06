package com.example.backend.controller;

import com.example.backend.dto.doctor.DoctorCreateRequest;
import com.example.backend.dto.doctor.DoctorUpdateRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.DoctorResponse;
import com.example.backend.dto.response.MemberResponse;
import com.example.backend.dto.response.FamilyResponse;
import com.example.backend.entity.Doctor;
import com.example.backend.entity.Member;
import com.example.backend.entity.Family;
import com.example.backend.service.DoctorService;
import com.example.backend.service.MemberService;
import com.example.backend.service.UserService;
import com.example.backend.service.FamilyService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin
public class DoctorController {
    private final DoctorService service;
    private final UserService userService;
    private final MemberService memberService;
    private final FamilyService familyService;
    
    public DoctorController(DoctorService service, UserService userService, MemberService memberService, FamilyService familyService) {
        this.service = service;
        this.userService = userService;
        this.memberService = memberService;
        this.familyService = familyService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ApiResponse<Page<DoctorResponse>> getAll(Pageable pageable) {
        return ApiResponse.<Page<DoctorResponse>>builder()
                .result(service.findAll(pageable).map(this::toResponse))
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER','DOCTOR')")
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
        Doctor created = service.create(entity);
        return ApiResponse.<DoctorResponse>builder()
                .result(toResponse(created))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    public ApiResponse<DoctorResponse> update(
            @PathVariable Integer id, 
            @Valid @RequestBody DoctorUpdateRequest req,
            @AuthenticationPrincipal Jwt jwt) {
        
        // Get userId from JWT
        Object userIdClaim = jwt.getClaim("userId");
        if (userIdClaim == null) {
            throw new RuntimeException("UserId not found in token");
        }
        Integer currentUserId = ((Number) userIdClaim).intValue();
        
        // Get role from JWT
        String role = jwt.getClaim("scope");
        
        // If not ADMIN, verify that the doctor is updating their own profile
        if (role != null && !role.contains("ROLE_ADMIN")) {
            // Get the doctor being updated
            Doctor existingDoctor = service.findById(id);
            if (!existingDoctor.getUser().getUserId().equals(currentUserId)) {
                throw new RuntimeException("Access Denied: You can only update your own profile");
            }
        }
        
        Doctor payload = new Doctor();
        payload.setUser(userService.findById(req.getUserId()));
        payload.setCertificateNumber(req.getCertificateNumber());
        payload.setSpecialization(req.getSpecialization());
        payload.setAddress(req.getAddress());
        payload.setClinicName(req.getClinicName());
        payload.setYearsOfExperience(req.getYearsOfExperience());
        payload.setEducation(req.getEducation());
        payload.setLanguagesSpoken(req.getLanguagesSpoken());
        payload.setConsultationFee(req.getConsultationFee());
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

    /**
     * Lấy danh sách tất cả bệnh nhân (members) thuộc các gia đình do bác sĩ này quản lý
     * Endpoint: GET /api/doctors/{id}/patients
     */
    @GetMapping("/{id}/patients")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    public ApiResponse<List<MemberResponse>> getPatientsByDoctorId(@PathVariable Integer id) {
        List<Member> members = memberService.findAllByDoctorId(id);
        List<MemberResponse> responses = members.stream()
                .map(this::toMemberResponse)
                .collect(Collectors.toList());
        return ApiResponse.<List<MemberResponse>>builder()
                .result(responses)
                .build();
    }

    /**
     * Lấy danh sách tất cả gia đình do bác sĩ này quản lý
     * Endpoint: GET /api/doctors/{id}/families
     */
    @GetMapping("/{id}/families")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    public ApiResponse<List<FamilyResponse>> getFamiliesByDoctorId(@PathVariable Integer id) {
        List<Family> families = familyService.findByDoctorId(id);
        List<FamilyResponse> responses = families.stream()
                .map(this::toFamilyResponse)
                .collect(Collectors.toList());
        return ApiResponse.<List<FamilyResponse>>builder()
                .result(responses)
                .build();
    }

    private DoctorResponse toResponse(Doctor d) {
        DoctorResponse res = new DoctorResponse();
        res.setDoctorId(d.getDoctorId());
        res.setCertificateNumber(d.getCertificateNumber());
        res.setSpecialization(d.getSpecialization());
        
        // Include all doctor-specific information
        res.setAddress(d.getAddress());
        res.setClinicName(d.getClinicName());
        res.setYearsOfExperience(d.getYearsOfExperience());
        res.setEducation(d.getEducation());
        res.setLanguagesSpoken(d.getLanguagesSpoken());
        res.setConsultationFee(d.getConsultationFee());
        res.setUpdatedAt(d.getUpdatedAt());
        
        // Include full user information
        if (d.getUser() != null) {
            res.setUserId(d.getUser().getUserId());
            res.setName(d.getUser().getName());
            res.setPhone(d.getUser().getPhone());
            res.setEmail(d.getUser().getEmail());
            res.setRole(d.getUser().getRole());
            res.setLocked(d.getUser().getLocked() != null ? d.getUser().getLocked() : false);
            res.setCreatedAt(d.getUser().getCreatedAt());
        }
        
        return res;
    }

    private MemberResponse toMemberResponse(Member m) {
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
        
        // Include User information (name from User entity)
        if (m.getUser() != null) {
            res.setName(m.getUser().getName());
        }
        
        // Include contact information from Member entity
        res.setPhone(m.getPhone());
        res.setEmail(m.getEmail());
        res.setAddress(m.getAddress());
        
        return res;
    }

    private FamilyResponse toFamilyResponse(Family f) {
        FamilyResponse res = new FamilyResponse();
        res.setFamilyId(f.getFamilyId());
        res.setDoctorId(f.getDoctor() != null ? f.getDoctor().getDoctorId() : null);
        res.setAddress(f.getAddress());
        res.setContactNumber(f.getContactNumber());
        
        // Include doctor name
        if (f.getDoctor() != null && f.getDoctor().getUser() != null) {
            res.setDoctorName(f.getDoctor().getUser().getName());
        }
        
        return res;
    }
}
