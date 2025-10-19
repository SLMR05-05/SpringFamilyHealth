package com.example.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "medication")
public class Medication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "medication_id")
    private Integer medicationId;

    @Column(name = "medication_name")
    private String medicationName;

    public Medication() {}

    public Integer getMedicationId() { return medicationId; }
    public void setMedicationId(Integer medicationId) { this.medicationId = medicationId; }
    public String getMedicationName() { return medicationName; }
    public void setMedicationName(String medicationName) { this.medicationName = medicationName; }
}
