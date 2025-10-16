package com.example.backend.models;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "family")
public class FamilyEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "family_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @Column(name = "address")
    private String address;

    @Column(name = "contact_number")
    private String contactNumber;

    @OneToMany(mappedBy = "family")
    private List<Member> members;

    @OneToMany(mappedBy = "family")
    private List<InviteCode> inviteCodes;

    public FamilyEntity() {}
    // ...getters/setters if needed...
}
