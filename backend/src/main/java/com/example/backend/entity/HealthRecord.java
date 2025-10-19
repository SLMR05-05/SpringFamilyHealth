package com.example.backend.entity;

import jakarta.persistence.*;

@Entity
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

    public Integer getRecordId() { return recordId; }
    public void setRecordId(Integer recordId) { this.recordId = recordId; }
    public Member getMember() { return member; }
    public void setMember(Member member) { this.member = member; }
    public String getBloodType() { return bloodType; }
    public void setBloodType(String bloodType) { this.bloodType = bloodType; }
    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }
    public String getChronicConditions() { return chronicConditions; }
    public void setChronicConditions(String chronicConditions) { this.chronicConditions = chronicConditions; }
}
