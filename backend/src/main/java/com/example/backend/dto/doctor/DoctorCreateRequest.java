package com.example.backend.dto.doctor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class DoctorCreateRequest {
    @NotNull
    private Integer userId;

    @NotBlank
    @Size(max = 100)
    private String certificateNumber;

    @Size(max = 1000)
    private String description;

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    public String getCertificateNumber() { return certificateNumber; }
    public void setCertificateNumber(String certificateNumber) { this.certificateNumber = certificateNumber; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
