package com.example.backend.models;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "visit_history")
public class VisitHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "visit_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(name = "visit_date")
    private LocalDate visitDate;

    @Lob
    @Column(name = "reason")
    private String reason;

    @Lob
    @Column(name = "diagnosis")
    private String diagnosis;

    @Column(name = "follow_up_date")
    private LocalDate followUpDate;

    @OneToMany(mappedBy = "visit")
    private List<Prescription> prescriptions;

    public VisitHistory() {}
    // ...getters/setters if needed...
}
