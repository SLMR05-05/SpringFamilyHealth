package com.example.backend.dto.response;

public class PrescriptionMedicationResponse {
    private Integer prescriptionId;
    private Integer medicationId;
    private String dosage;
    private String duration;

    public Integer getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(Integer prescriptionId) { this.prescriptionId = prescriptionId; }
    public Integer getMedicationId() { return medicationId; }
    public void setMedicationId(Integer medicationId) { this.medicationId = medicationId; }
    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
}
