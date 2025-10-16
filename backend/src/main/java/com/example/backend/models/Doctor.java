package com.example.backend.models;

import jakarta.persistence.*;
import java.util.List;

import org.hibernate.type.descriptor.jdbc.JdbcTypeFamilyInformation.Family;

@Entity
@Table(name = "doctor")
public class Doctor {
    @Id
    @Column(name = "doctor_id")
    private Integer id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "doctor_id")
    private User user;

    @Column(name = "certificate_number", unique = true, length = 255)
    private String certificateNumber;

    @Lob
    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "doctor")
    private List<Family> families;

    public Doctor() {}
    
}
