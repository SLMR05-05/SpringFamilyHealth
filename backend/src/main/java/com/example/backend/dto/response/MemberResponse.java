package com.example.backend.dto.response;

import java.time.LocalDate;

public class MemberResponse {
    private Integer memberId;
    private Integer userId;
    private Integer familyId;
    private Integer age;
    private LocalDate dayOfBirth;
    private String gender;
    private Float weight;
    private Float height;
    private String relationship;
    private String roleInFamily;

    public Integer getMemberId() { return memberId; }
    public void setMemberId(Integer memberId) { this.memberId = memberId; }
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    public Integer getFamilyId() { return familyId; }
    public void setFamilyId(Integer familyId) { this.familyId = familyId; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public LocalDate getDayOfBirth() { return dayOfBirth; }
    public void setDayOfBirth(LocalDate dayOfBirth) { this.dayOfBirth = dayOfBirth; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public Float getWeight() { return weight; }
    public void setWeight(Float weight) { this.weight = weight; }
    public Float getHeight() { return height; }
    public void setHeight(Float height) { this.height = height; }
    public String getRelationship() { return relationship; }
    public void setRelationship(String relationship) { this.relationship = relationship; }
    public String getRoleInFamily() { return roleInFamily; }
    public void setRoleInFamily(String roleInFamily) { this.roleInFamily = roleInFamily; }
}
