package com.example.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "doctor")
public class Doctor {

    @Id
    @Column(name = "doctor_id")
    private Integer doctorId; // Shared PK with User

    @OneToOne
    @MapsId
    @JoinColumn(name = "doctor_id")
    private User user;

    @Column(name = "certificate_number", unique = true)
    private String certificateNumber;

    @Column(name = "description", columnDefinition = "text")
    private String description;


    public Doctor() {}

    public Integer getDoctorId() { return doctorId; }
    public void setDoctorId(Integer doctorId) { this.doctorId = doctorId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getCertificateNumber() { return certificateNumber; }
    public void setCertificateNumber(String certificateNumber) { this.certificateNumber = certificateNumber; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

}
