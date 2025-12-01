package com.example.backend.controller;

import com.example.backend.dto.appointment.AppointmentCreateRequest;
import com.example.backend.dto.appointment.AppointmentResponse;
import com.example.backend.dto.appointment.AppointmentUpdateRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.entity.Appointment;
import com.example.backend.entity.Doctor;
import com.example.backend.entity.Member;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.example.backend.service.AppointmentService;
import com.example.backend.service.DoctorService;
import com.example.backend.service.MemberService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin
@Tag(name = "Appointments", description = "Appointment management APIs for scheduling and tracking medical appointments")
public class AppointmentController {
    private final AppointmentService appointmentService;
    private final DoctorService doctorService;
    private final MemberService memberService;

    public AppointmentController(
            AppointmentService appointmentService,
            DoctorService doctorService,
            MemberService memberService) {
        this.appointmentService = appointmentService;
        this.doctorService = doctorService;
        this.memberService = memberService;
    }

    /**
     * Get all appointments by doctor ID
     */
    @Operation(
            summary = "Get appointments by doctor ID",
            description = "Retrieve all appointments for a specific doctor. Requires ADMIN or DOCTOR role."
    )
    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    public ApiResponse<List<AppointmentResponse>> getByDoctorId(
            @Parameter(description = "ID of the doctor", required = true)
            @PathVariable Integer doctorId) {
        List<Appointment> appointments = appointmentService.findByDoctorId(doctorId);
        return ApiResponse.<List<AppointmentResponse>>builder()
                .result(appointments.stream().map(this::toResponse).collect(Collectors.toList()))
                .build();
    }

    /**
     * Get upcoming appointments for a doctor
     */
    @GetMapping("/doctor/{doctorId}/upcoming")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    public ApiResponse<List<AppointmentResponse>> getUpcomingByDoctor(@PathVariable Integer doctorId) {
        List<Appointment> appointments = appointmentService.findUpcomingByDoctor(doctorId);
        return ApiResponse.<List<AppointmentResponse>>builder()
                .result(appointments.stream().map(this::toResponse).collect(Collectors.toList()))
                .build();
    }

    /**
     * Get appointments by doctor and date range
     */
    @GetMapping("/doctor/{doctorId}/range")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    public ApiResponse<List<AppointmentResponse>> getByDoctorAndDateRange(
            @PathVariable Integer doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<Appointment> appointments = appointmentService.findByDoctorAndDateRange(doctorId, startDate, endDate);
        return ApiResponse.<List<AppointmentResponse>>builder()
                .result(appointments.stream().map(this::toResponse).collect(Collectors.toList()))
                .build();
    }

    /**
     * Get appointments by member ID
     */
    @GetMapping("/member/{memberId}")
    @PreAuthorize("hasAnyRole('ADMIN','USER','DOCTOR')")
    public ApiResponse<List<AppointmentResponse>> getByMemberId(@PathVariable Integer memberId) {
        List<Appointment> appointments = appointmentService.findByMemberId(memberId);
        return ApiResponse.<List<AppointmentResponse>>builder()
                .result(appointments.stream().map(this::toResponse).collect(Collectors.toList()))
                .build();
    }

    /**
     * Get appointment by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER','DOCTOR')")
    public ApiResponse<AppointmentResponse> getById(@PathVariable Integer id) {
        Appointment appointment = appointmentService.findById(id);
        return ApiResponse.<AppointmentResponse>builder()
                .result(toResponse(appointment))
                .build();
    }

    /**
     * Create new appointment
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER','DOCTOR')")
    public ApiResponse<AppointmentResponse> create(@Valid @RequestBody AppointmentCreateRequest req) {
        // Find member and eager-load family (use findByUserId which LEFT JOIN FETCH family)
        Member member;
        try {
            member = memberService.findByUserId(req.getMemberId());
        } catch (com.example.backend.service.NotFoundException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Member not found: " + req.getMemberId());
        }

        // Resolve doctor: prefer provided doctorId; otherwise use family's assigned doctor
        Doctor doctor = null;
        if (req.getDoctorId() != null) {
            try {
                doctor = doctorService.findById(req.getDoctorId());
            } catch (com.example.backend.service.NotFoundException ex) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Doctor not found: " + req.getDoctorId());
            }
        } else if (member != null && member.getFamily() != null && member.getFamily().getDoctor() != null) {
            doctor = member.getFamily().getDoctor();
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Doctor ID is required or the member's family must have an assigned doctor");
        }

        Appointment appointment = new Appointment();
        appointment.setDoctor(doctor);
        appointment.setMember(member);
        appointment.setAppointmentDate(req.getAppointmentDate());
        appointment.setReason(req.getReason());
        appointment.setNotes(req.getNotes());
        appointment.setStatus("SCHEDULED");

        Appointment created = appointmentService.create(appointment);
        return ApiResponse.<AppointmentResponse>builder()
                .result(toResponse(created))
                .build();
    }

    /**
     * Update appointment
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR','USER')")
    public ApiResponse<AppointmentResponse> update(
            @PathVariable Integer id,
            @Valid @RequestBody AppointmentUpdateRequest req) {
        Appointment existing = appointmentService.findById(id);
        
        if (req.getAppointmentDate() != null) {
            existing.setAppointmentDate(req.getAppointmentDate());
        }
        if (req.getStatus() != null) {
            existing.setStatus(req.getStatus());
        }
        if (req.getReason() != null) {
            existing.setReason(req.getReason());
        }
        if (req.getNotes() != null) {
            existing.setNotes(req.getNotes());
        }

        Appointment updated = appointmentService.update(id, existing);
        return ApiResponse.<AppointmentResponse>builder()
                .result(toResponse(updated))
                .build();
    }

    /**
     * Update appointment status
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR','USER')")
    public ApiResponse<AppointmentResponse> updateStatus(
            @PathVariable Integer id,
            @RequestParam String status) {
        Appointment updated = appointmentService.updateStatus(id, status);
        return ApiResponse.<AppointmentResponse>builder()
                .result(toResponse(updated))
                .build();
    }

    /**
     * Delete appointment
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR','USER')")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        appointmentService.delete(id);
        return ApiResponse.<Void>builder()
                .message("Appointment deleted successfully")
                .build();
    }

    // Helper method
    private AppointmentResponse toResponse(Appointment appointment) {
        return AppointmentResponse.builder()
                .appointmentId(appointment.getAppointmentId())
                .memberId(appointment.getMember() != null ? appointment.getMember().getMemberId() : null)
                .doctorId(appointment.getDoctor() != null ? appointment.getDoctor().getDoctorId() : null)
                .appointmentDate(appointment.getAppointmentDate())
                .status(appointment.getStatus())
                .reason(appointment.getReason())
                .notes(appointment.getNotes())
                .createdAt(appointment.getCreatedAt())
                .updatedAt(appointment.getUpdatedAt())
                .build();
    }
}
