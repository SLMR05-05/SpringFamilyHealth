package com.example.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class PrescriptionMedicationId implements Serializable {
    @Column(name = "prescription_id")
    private Integer prescriptionId;

    @Column(name = "medication_id")
    private Integer medicationId;

    public PrescriptionMedicationId() {}

    public PrescriptionMedicationId(Integer prescriptionId, Integer medicationId) {
        this.prescriptionId = prescriptionId;
        this.medicationId = medicationId;
    }

    public Integer getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(Integer prescriptionId) { this.prescriptionId = prescriptionId; }
    public Integer getMedicationId() { return medicationId; }
    public void setMedicationId(Integer medicationId) { this.medicationId = medicationId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PrescriptionMedicationId that = (PrescriptionMedicationId) o;
        return Objects.equals(prescriptionId, that.prescriptionId) && Objects.equals(medicationId, that.medicationId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(prescriptionId, medicationId);
    }
}
