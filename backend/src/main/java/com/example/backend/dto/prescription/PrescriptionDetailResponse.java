package com.example.backend.dto.prescription;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionDetailResponse {
    private Integer prescriptionId;
    private Integer memberId;
    private Integer appointmentId;
    private Integer doctorId;
    private String doctorName;
    private String note;
    private String status;
    private LocalDateTime prescribedAt;
    private List<PrescriptionMedicationDetail> medications;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PrescriptionMedicationDetail {
        private Integer medicationId;
        private String medicationName;
        private String dosage;
        private String duration;
    }
}