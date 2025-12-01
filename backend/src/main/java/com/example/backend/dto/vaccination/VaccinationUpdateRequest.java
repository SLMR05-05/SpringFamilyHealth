package com.example.backend.dto.vaccination;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class VaccinationUpdateRequest {
    @NotNull
    private Integer memberId;
    private Integer doctorId;
    @NotBlank
    @Size(max = 100)
    private String vaccineName;
    @NotNull
    private LocalDate dateGiven;
    private LocalDate nextDose;
    private String location;
    private String notes;

    public Integer getMemberId() { return memberId; }
    public void setMemberId(Integer memberId) { this.memberId = memberId; }
    public Integer getDoctorId() { return doctorId; }
    public void setDoctorId(Integer doctorId) { this.doctorId = doctorId; }
    public String getVaccineName() { return vaccineName; }
    public void setVaccineName(String vaccineName) { this.vaccineName = vaccineName; }
    public LocalDate getDateGiven() { return dateGiven; }
    public void setDateGiven(LocalDate dateGiven) { this.dateGiven = dateGiven; }
    public LocalDate getNextDose() { return nextDose; }
    public void setNextDose(LocalDate nextDose) { this.nextDose = nextDose; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
