package com.example.backend.models;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "medication")
public class Medication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "medication_id")
    private Integer id;

    @Column(name = "medication_name")
    private String medicationName;

    @OneToMany(mappedBy = "medication")
    private List<PrescriptionMedication> prescriptions;

    public Medication() {}
    // ...getters/setters if needed...
}
