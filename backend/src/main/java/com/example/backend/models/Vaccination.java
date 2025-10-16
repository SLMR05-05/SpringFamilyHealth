package com.example.backend.models;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "vaccination")
public class Vaccination {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vaccine_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(name = "vaccine_name")
    private String vaccineName;

    @Column(name = "date_given")
    private LocalDate dateGiven;

    public Vaccination() {}
    // ...getters/setters if needed...
}
