package com.example.backend.dto.prescriptionmedication;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class PrescriptionMedicationByNameRequest {
    @NotNull
    private Integer prescriptionId;
    @NotNull
    @Size(min = 1, max = 200)
    private String medicationName;
    @Size(max = 100)
    private String dosage;
    @Size(max = 100)
    private String frequency; // Tần suất sử dụng (frequency được lưu vào duration)

    public Integer getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(Integer prescriptionId) { this.prescriptionId = prescriptionId; }
    public String getMedicationName() { return medicationName; }
    public void setMedicationName(String medicationName) { this.medicationName = medicationName; }
    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }
    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }
}
