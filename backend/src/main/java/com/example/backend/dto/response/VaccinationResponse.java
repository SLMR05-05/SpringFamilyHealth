package com.example.backend.dto.response;

import java.time.LocalDate;

public class VaccinationResponse {
    private Integer vaccineId;
    private Integer memberId;
    private String vaccineName;
    private LocalDate dateGiven;

    public Integer getVaccineId() { return vaccineId; }
    public void setVaccineId(Integer vaccineId) { this.vaccineId = vaccineId; }
    public Integer getMemberId() { return memberId; }
    public void setMemberId(Integer memberId) { this.memberId = memberId; }
    public String getVaccineName() { return vaccineName; }
    public void setVaccineName(String vaccineName) { this.vaccineName = vaccineName; }
    public LocalDate getDateGiven() { return dateGiven; }
    public void setDateGiven(LocalDate dateGiven) { this.dateGiven = dateGiven; }
}
