package com.example.backend.dto.healthrecord;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class HealthRecordCreateForMeRequest {
    @NotBlank(message = "bloodType is required")
    @Size(max = 10)
    private String bloodType;

    @Size(max = 2000)
    private String allergies;

    @Size(max = 2000)
    private String chronicConditions;

    public String getBloodType() { return bloodType; }
    public void setBloodType(String bloodType) { this.bloodType = bloodType; }
    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }
    public String getChronicConditions() { return chronicConditions; }
    public void setChronicConditions(String chronicConditions) { this.chronicConditions = chronicConditions; }
}
