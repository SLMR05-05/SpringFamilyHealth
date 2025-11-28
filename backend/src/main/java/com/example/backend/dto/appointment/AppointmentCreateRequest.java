package com.example.backend.dto.appointment;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentCreateRequest {
    @NotNull(message = "Member ID is required")
    private Integer memberId;

    // doctorId is optional. If not provided, controller will derive doctor from member's family
    private Integer doctorId;

    @NotNull(message = "Appointment date is required")
    private LocalDateTime appointmentDate;

    private String reason;
    private String notes;
}
