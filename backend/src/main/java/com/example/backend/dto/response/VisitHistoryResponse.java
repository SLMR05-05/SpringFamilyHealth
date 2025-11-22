package com.example.backend.dto.response;

import java.time.LocalDate;

public class VisitHistoryResponse {
    private Integer visitId;
    private Integer memberId;
    private LocalDate visitDate;
    private String reason;
    private String diagnosis;
    private LocalDate followUpDate;

    public Integer getVisitId() { return visitId; }
    public void setVisitId(Integer visitId) { this.visitId = visitId; }
    public Integer getMemberId() { return memberId; }
    public void setMemberId(Integer memberId) { this.memberId = memberId; }
    public LocalDate getVisitDate() { return visitDate; }
    public void setVisitDate(LocalDate visitDate) { this.visitDate = visitDate; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }
    public LocalDate getFollowUpDate() { return followUpDate; }
    public void setFollowUpDate(LocalDate followUpDate) { this.followUpDate = followUpDate; }
}
