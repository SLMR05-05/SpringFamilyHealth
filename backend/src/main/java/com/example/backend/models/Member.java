package com.example.backend.models;

import com.example.backend.models.enums.*;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "member")
public class Member {
    @Id
    @Column(name = "member_id")
    private Integer id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "member_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "family_id")
    private FamilyEntity family;

    @Column(name = "age")
    private Integer age;

    @Column(name = "day_of_birth")
    private LocalDate dayOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", length = 255)
    private Gender gender;

    @Column(name = "weight")
    private Double weight;

    @Column(name = "height")
    private Double height;

    @Column(name = "relationship", length = 255)
    private String relationship;

    @Enumerated(EnumType.STRING)
    @Column(name = "role_in_family", length = 255)
    private FacilityRole roleInFamily;

    @OneToMany(mappedBy = "member")
    private List<VisitHistory> visitHistories;

    @OneToMany(mappedBy = "member")
    private List<Prescription> prescriptions;

    @OneToMany(mappedBy = "member")
    private List<Vaccination> vaccinations;

    @OneToOne(mappedBy = "member")
    private HealthRecord healthRecord;

    public Member() {}
    // ...optional getters/setters...
}
