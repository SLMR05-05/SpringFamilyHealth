package com.example.backend.models;

import jakarta.persistence.*;

@Entity
@Table(name = "prescription_medication")
public class PrescriptionMedication {
    @EmbeddedId
    private PrescriptionMedicationId id;

    @ManyToOne
    @MapsId("prescriptionId")
    @JoinColumn(name = "prescription_id")
    private Prescription prescription;

    @ManyToOne
    @MapsId("medicationId")
    @JoinColumn(name = "medication_id")
    private Medication medication;

    @Column(name = "dosage", length = 255)
    private String dosage;

    @Column(name = "duration", length = 255)
    private String duration;

    public PrescriptionMedication() {}
    // ...optional getters/setters...
}
