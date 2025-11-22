package com.example.backend.dto.response;

public class MedicationResponse {
    private Integer medicationId;
    private String medicationName;

    public Integer getMedicationId() { return medicationId; }
    public void setMedicationId(Integer medicationId) { this.medicationId = medicationId; }
    public String getMedicationName() { return medicationName; }
    public void setMedicationName(String medicationName) { this.medicationName = medicationName; }
}
