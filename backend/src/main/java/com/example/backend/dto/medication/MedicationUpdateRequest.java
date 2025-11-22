package com.example.backend.dto.medication;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class MedicationUpdateRequest {
    @NotBlank
    @Size(max = 100)
    private String medicationName;

    public String getMedicationName() { return medicationName; }
    public void setMedicationName(String medicationName) { this.medicationName = medicationName; }
}
