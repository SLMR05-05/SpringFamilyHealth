package com.example.backend.dto.response;

public class PrescriptionResponse {
    private Integer prescriptionId;
    private Integer memberId;
    private Integer visitId;
    private String note;

    public Integer getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(Integer prescriptionId) { this.prescriptionId = prescriptionId; }
    public Integer getMemberId() { return memberId; }
    public void setMemberId(Integer memberId) { this.memberId = memberId; }
    public Integer getVisitId() { return visitId; }
    public void setVisitId(Integer visitId) { this.visitId = visitId; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
