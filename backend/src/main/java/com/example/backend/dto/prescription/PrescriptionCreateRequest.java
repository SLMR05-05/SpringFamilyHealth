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

    public Integer getMemberId() { return memberId; }
    public void setMemberId(Integer memberId) { this.memberId = memberId; }
    public Integer getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Integer appointmentId) { this.appointmentId = appointmentId; }
    public Integer getDoctorId() { return doctorId; }
    public void setDoctorId(Integer doctorId) { this.doctorId = doctorId; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
