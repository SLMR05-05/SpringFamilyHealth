package com.example.backend.dto.response;

public class FamilyResponse {
    private Integer familyId;
    private Integer doctorId;
    private String doctorName;
    private String address;
    private String contactNumber;

    public Integer getFamilyId() { return familyId; }
    public void setFamilyId(Integer familyId) { this.familyId = familyId; }
    public Integer getDoctorId() { return doctorId; }
    public void setDoctorId(Integer doctorId) { this.doctorId = doctorId; }
    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
}
