package com.example.backend.models;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class PrescriptionMedicationId implements Serializable {
    private Integer prescriptionId;
    private Integer medicationId;

    public PrescriptionMedicationId() {}

    public PrescriptionMedicationId(Integer prescriptionId, Integer medicationId) {
        this.prescriptionId = prescriptionId;
        this.medicationId = medicationId;
    }

    public Integer getPrescriptionId() { return prescriptionId; }
    public Integer getMedicationId() { return medicationId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PrescriptionMedicationId)) return false;
        PrescriptionMedicationId that = (PrescriptionMedicationId) o;
        return Objects.equals(prescriptionId, that.prescriptionId) &&
               Objects.equals(medicationId, that.medicationId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(prescriptionId, medicationId);
    }
}
