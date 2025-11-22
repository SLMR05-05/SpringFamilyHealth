package com.example.backend.dto.prescriptionmedication;

import jakarta.validation.constraints.Size;

public class PrescriptionMedicationUpdateRequest {
    @Size(max = 100)
    private String dosage;
    @Size(max = 100)
    private String duration;

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
}
