package com.example.backend.models;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "prescription")
public class Prescription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "prescription_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne
    @JoinColumn(name = "visit_id")
    private VisitHistory visit;

    @Lob
    @Column(name = "note")
    private String note;

    @OneToMany(mappedBy = "prescription")
    private List<PrescriptionMedication> items;

    public Prescription() {}
    // ...getters/setters if needed...
}
