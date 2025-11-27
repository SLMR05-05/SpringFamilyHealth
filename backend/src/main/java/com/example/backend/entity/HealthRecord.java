package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "health_record")
public class HealthRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "record_id")
    private Integer recordId;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(name = "blood_type")
    private String bloodType;

    @Column(name = "allergies", columnDefinition = "text")
    private String allergies;

    @Column(name = "chronic_conditions", columnDefinition = "text")
    private String chronicConditions;

    public HealthRecord() {}

}
