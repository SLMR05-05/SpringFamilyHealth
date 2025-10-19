package com.example.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "member")
public class Member {
    @Id
    @Column(name = "member_id")
    private Integer memberId; // Shared PK with User

    @OneToOne
    @MapsId
    @JoinColumn(name = "member_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "family_id")
    private Family family;

    @Column(name = "age")
    private Integer age;

    @Column(name = "day_of_birth")
    private LocalDate dayOfBirth;

    @Column(name = "gender")
    private String gender;

    @Column(name = "weight")
    private Float weight;

    @Column(name = "height")
    private Float height;

    @Column(name = "relationship")
    private String relationship;

    @Column(name = "role_in_family")
    private String roleInFamily;

    public Member() {}

    public Integer getMemberId() { return memberId; }
    public void setMemberId(Integer memberId) { this.memberId = memberId; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Family getFamily() { return family; }
    public void setFamily(Family family) { this.family = family; }
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
