package com.example.backend.dto.prescription;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class PrescriptionUpdateRequest {
    @NotNull
    private Integer memberId;
    @NotNull
    private Integer visitId;
    @Size(max = 2000)
    private String note;

    public Integer getMemberId() { return memberId; }
    public void setMemberId(Integer memberId) { this.memberId = memberId; }
    public Integer getVisitId() { return visitId; }
    public void setVisitId(Integer visitId) { this.visitId = visitId; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
