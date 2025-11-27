package com.example.backend.dto.prescriptionmedication;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class PrescriptionMedicationCreateRequest {
    @NotNull
    private Integer prescriptionId;
    @NotNull
    private Integer medicationId;
    @Size(max = 100)
    private String dosage;
    @Size(max = 100)
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
