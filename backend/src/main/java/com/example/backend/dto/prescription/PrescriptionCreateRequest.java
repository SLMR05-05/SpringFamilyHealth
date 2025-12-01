package com.example.backend.dto.prescription;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class PrescriptionCreateRequest {
    @NotNull
    private Integer memberId;
    private Integer appointmentId; // Optional, có thể tạo đơn thuốc mà không cần appointment
    private Integer doctorId; // Optional
    @Size(max = 2000)
    private String note;
    private java.util.List<PrescriptionMedicationRequest> medications;

    public static class PrescriptionMedicationRequest {
        private Integer medicationId;
        private String name;
        private String dosage;
        private String duration;

        public Integer getMedicationId() { return medicationId; }
        public void setMedicationId(Integer medicationId) { this.medicationId = medicationId; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDosage() { return dosage; }
        public void setDosage(String dosage) { this.dosage = dosage; }
        public String getDuration() { return duration; }
        public void setDuration(String duration) { this.duration = duration; }
    }

    public Integer getMemberId() { return memberId; }
    public void setMemberId(Integer memberId) { this.memberId = memberId; }
    public Integer getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Integer appointmentId) { this.appointmentId = appointmentId; }
    public Integer getDoctorId() { return doctorId; }
    public void setDoctorId(Integer doctorId) { this.doctorId = doctorId; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public java.util.List<PrescriptionMedicationRequest> getMedications() { return medications; }
    public void setMedications(java.util.List<PrescriptionMedicationRequest> medications) { this.medications = medications; }
}
