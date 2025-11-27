package com.example.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "vaccination")
public class Vaccination {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vaccine_id")
    private Integer vaccineId;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(name = "vaccine_name")
    private String vaccineName;

    @Column(name = "date_given")
    private LocalDate dateGiven;

    public Vaccination() {}

    public Integer getVaccineId() { return vaccineId; }
    public void setVaccineId(Integer vaccineId) { this.vaccineId = vaccineId; }
    public Member getMember() { return member; }
    public void setMember(Member member) { this.member = member; }
    public String getVaccineName() { return vaccineName; }
    public void setVaccineName(String vaccineName) { this.vaccineName = vaccineName; }
    public LocalDate getDateGiven() { return dateGiven; }
    public void setDateGiven(LocalDate dateGiven) { this.dateGiven = dateGiven; }
}
