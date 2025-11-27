package com.example.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "prescription_medication")
public class PrescriptionMedication {

    @EmbeddedId
    private PrescriptionMedicationId id = new PrescriptionMedicationId();

    @ManyToOne
    @MapsId("prescriptionId")
    @JoinColumn(name = "prescription_id")
    private Prescription prescription;

    @ManyToOne
    @MapsId("medicationId")
    @JoinColumn(name = "medication_id")
    private Medication medication;

    @Column(name = "dosage")
    private String dosage;

    @Column(name = "duration")
    private String duration;

    public PrescriptionMedication() {}

    public PrescriptionMedicationId getId() { return id; }
    public void setId(PrescriptionMedicationId id) { this.id = id; }
    public Prescription getPrescription() { return prescription; }
    public void setPrescription(Prescription prescription) { this.prescription = prescription; }
    public Medication getMedication() { return medication; }
    public void setMedication(Medication medication) { this.medication = medication; }
    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
}
