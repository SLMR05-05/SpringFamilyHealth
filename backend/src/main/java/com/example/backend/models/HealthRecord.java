package com.example.backend.models;

import jakarta.persistence.*;

@Entity
@Table(name = "health_record")
public class HealthRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "record_id")
    private Integer id;

    @OneToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(name = "blood_type")
    private String bloodType;

    @Lob
    @Column(name = "allergies")
    private String allergies;

    @Lob
    @Column(name = "chronic_conditions")
    private String chronicConditions;

    public HealthRecord() {}
    // ...getters/setters if needed...
}
