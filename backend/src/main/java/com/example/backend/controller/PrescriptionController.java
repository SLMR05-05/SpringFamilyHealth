package com.example.backend.controller;

import com.example.backend.dto.prescription.PrescriptionCreateRequest;
import com.example.backend.dto.prescription.PrescriptionUpdateRequest;
import com.example.backend.dto.prescription.PrescriptionDetailResponse;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.PrescriptionResponse;
import com.example.backend.entity.Prescription;
import com.example.backend.entity.PrescriptionMedication;
import com.example.backend.service.MemberService;
import com.example.backend.service.PrescriptionService;
import com.example.backend.service.PrescriptionMedicationService;
import com.example.backend.service.AppointmentService;
import com.example.backend.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin
public class PrescriptionController {
    private final PrescriptionService service;
    private final MemberService memberService;
    private final PrescriptionMedicationService prescriptionMedicationService;
    private final AppointmentService appointmentService;
    private final DoctorService doctorService;
    
    public PrescriptionController(PrescriptionService service, MemberService memberService, 
                                PrescriptionMedicationService prescriptionMedicationService,
                                AppointmentService appointmentService,
                                DoctorService doctorService) {
        this.service = service;
        this.memberService = memberService;
        this.prescriptionMedicationService = prescriptionMedicationService;
        this.appointmentService = appointmentService;
        this.doctorService = doctorService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER','DOCTOR')")
    public ApiResponse<Page<PrescriptionResponse>> getAll(Pageable pageable) {
        return ApiResponse.<Page<PrescriptionResponse>>builder()
                .result(service.findAll(pageable).map(this::toResponse))
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER','DOCTOR')")
    public ApiResponse<PrescriptionResponse> getById(@PathVariable Integer id) {
        return ApiResponse.<PrescriptionResponse>builder()
                .result(toResponse(service.findById(id)))
                .build();
    }

    /**
     * Lấy chi tiết đơn thuốc bao gồm danh sách thuốc
     */
    @GetMapping("/{id}/detail")
    @PreAuthorize("hasAnyRole('ADMIN','USER','DOCTOR')")
    public ApiResponse<PrescriptionDetailResponse> getPrescriptionDetail(@PathVariable Integer id) {
        Prescription prescription = service.findByIdWithDetails(id);
        List<PrescriptionMedication> medications = prescriptionMedicationService.findByPrescriptionId(id);
        
        PrescriptionDetailResponse detail = PrescriptionDetailResponse.builder()
                .prescriptionId(prescription.getPrescriptionId())
                .memberId(prescription.getMember() != null ? prescription.getMember().getMemberId() : null)
                .appointmentId(prescription.getAppointment() != null ? prescription.getAppointment().getAppointmentId() : null)
                .doctorId(prescription.getDoctor() != null ? prescription.getDoctor().getDoctorId() : null)
                .doctorName(prescription.getDoctor() != null && prescription.getDoctor().getDoctorId() != null ? 
                          getDoctorNameById(prescription.getDoctor().getDoctorId()) : null)
                .note(prescription.getNote())
                .status(prescription.getStatus())
                .prescribedAt(prescription.getPrescribedAt())
                .medications(medications.stream().map(pm -> 
                    PrescriptionDetailResponse.PrescriptionMedicationDetail.builder()
                            .medicationId(pm.getMedication().getMedicationId())
                            .medicationName(pm.getMedication().getMedicationName())
                            .dosage(pm.getDosage())
                            .duration(pm.getDuration())
                            .build()
                ).collect(Collectors.toList()))
                .build();
                
        return ApiResponse.<PrescriptionDetailResponse>builder()
                .result(detail)
                .build();
    }

    /**
     * Lấy tất cả đơn thuốc của một member
     */
    @GetMapping("/member/{memberId}")
    @PreAuthorize("hasAnyRole('ADMIN','USER','DOCTOR')")
    public ApiResponse<List<PrescriptionDetailResponse>> getPrescriptionsByMember(@PathVariable Integer memberId) {
        List<Prescription> prescriptions = service.findByMemberId(memberId);
        
        List<PrescriptionDetailResponse> details = prescriptions.stream().map(prescription -> {
            List<PrescriptionMedication> medications = prescriptionMedicationService.findByPrescriptionId(prescription.getPrescriptionId());
            
            return PrescriptionDetailResponse.builder()
                    .prescriptionId(prescription.getPrescriptionId())
                    .memberId(prescription.getMember() != null ? prescription.getMember().getMemberId() : null)
                    .appointmentId(prescription.getAppointment() != null ? prescription.getAppointment().getAppointmentId() : null)
                    .doctorId(prescription.getDoctor() != null ? prescription.getDoctor().getDoctorId() : null)
                    .doctorName(prescription.getDoctor() != null && prescription.getDoctor().getDoctorId() != null ? 
                              getDoctorNameById(prescription.getDoctor().getDoctorId()) : null)
                    .note(prescription.getNote())
                    .status(prescription.getStatus())
                    .prescribedAt(prescription.getPrescribedAt())
                    .medications(medications.stream().map(pm -> 
                        PrescriptionDetailResponse.PrescriptionMedicationDetail.builder()
                                .medicationId(pm.getMedication().getMedicationId())
                                .medicationName(pm.getMedication().getMedicationName())
                                .dosage(pm.getDosage())
                                .duration(pm.getDuration())
                                .build()
                    ).collect(Collectors.toList()))
                    .build();
        }).collect(Collectors.toList());
        
        return ApiResponse.<List<PrescriptionDetailResponse>>builder()
                .result(details)
                .build();
    }

    /**
     * Cập nhật trạng thái đơn thuốc
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR','USER')")
    public ApiResponse<Void> updatePrescriptionStatus(@PathVariable Integer id, @RequestParam String status) {
        Prescription prescription = service.findById(id);
        prescription.setStatus(status);
        service.update(id, prescription);
        
        return ApiResponse.<Void>builder()
                .message("Prescription status updated successfully")
                .build();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    public ApiResponse<PrescriptionResponse> create(@Valid @RequestBody PrescriptionCreateRequest req) {
        Prescription entity = new Prescription();
        entity.setMember(memberService.findById(req.getMemberId()));
        // Update to use appointment instead of visit
        if (req.getAppointmentId() != null) {
            entity.setAppointment(appointmentService.findById(req.getAppointmentId()));
        }
        if (req.getDoctorId() != null) {
            entity.setDoctor(doctorService.findById(req.getDoctorId()));
        }
        entity.setNote(req.getNote());
        entity.setStatus("ACTIVE"); // Default status
        entity.setPrescribedAt(LocalDateTime.now());
        
        Prescription created = service.create(entity);
        return ApiResponse.<PrescriptionResponse>builder()
                .result(toResponse(created))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    public ApiResponse<PrescriptionResponse> update(@PathVariable Integer id, @Valid @RequestBody PrescriptionUpdateRequest req) {
        Prescription payload = new Prescription();
        payload.setMember(memberService.findById(req.getMemberId()));
        if (req.getAppointmentId() != null) {
            payload.setAppointment(appointmentService.findById(req.getAppointmentId()));
        }
        if (req.getDoctorId() != null) {
            payload.setDoctor(doctorService.findById(req.getDoctorId()));
        }
        payload.setNote(req.getNote());
        if (req.getStatus() != null) {
            payload.setStatus(req.getStatus());
        }
        
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
        res.setAppointmentId(p.getAppointment() != null ? p.getAppointment().getAppointmentId() : null);
        res.setDoctorId(p.getDoctor() != null ? p.getDoctor().getDoctorId() : null);
        res.setNote(p.getNote());
        res.setStatus(p.getStatus());
        res.setPrescribedAt(p.getPrescribedAt());
        return res;
    }

    // Helper method để lấy tên doctor
    private String getDoctorNameById(Integer doctorId) {
        try {
            return doctorService.findById(doctorId).getUser().getName();
        } catch (Exception e) {
            return "Doctor " + doctorId; // Fallback nếu không tìm thấy
        }
    }
}
