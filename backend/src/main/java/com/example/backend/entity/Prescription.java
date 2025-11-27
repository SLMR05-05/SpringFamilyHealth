package com.example.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "prescription")
public class Prescription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "prescription_id")
    private Integer prescriptionId;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne
    @JoinColumn(name = "visit_id")
    private VisitHistory visit;

    @Column(name = "note", columnDefinition = "text")
    private String note;

    public Prescription() {}

    public Integer getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(Integer prescriptionId) { this.prescriptionId = prescriptionId; }
    public Member getMember() { return member; }
    public void setMember(Member member) { this.member = member; }
    public VisitHistory getVisit() { return visit; }
    public void setVisit(VisitHistory visit) { this.visit = visit; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
