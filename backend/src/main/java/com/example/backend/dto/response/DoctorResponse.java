package com.example.backend.dto.response;

public class DoctorResponse {
    private Integer doctorId;
    private Integer userId;
    private String certificateNumber;
    private String description;

    public Integer getDoctorId() { return doctorId; }
    public void setDoctorId(Integer doctorId) { this.doctorId = doctorId; }
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    public String getCertificateNumber() { return certificateNumber; }
    public void setCertificateNumber(String certificateNumber) { this.certificateNumber = certificateNumber; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
