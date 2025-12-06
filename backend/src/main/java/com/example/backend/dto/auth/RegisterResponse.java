package com.example.backend.dto.auth;

public class RegisterResponse {
    private Integer userId;
    private String email;
    private String name;
    private Integer familyId;
    private String roleInFamily;
    private String message;

    public RegisterResponse() {}

    public RegisterResponse(Integer userId, String email, String name, Integer familyId, String roleInFamily, String message) {
        this.userId = userId;
        this.email = email;
        this.name = name;
        this.familyId = familyId;
        this.roleInFamily = roleInFamily;
        this.message = message;
    }

    // Getters and Setters
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getFamilyId() {
        return familyId;
    }

    public void setFamilyId(Integer familyId) {
        this.familyId = familyId;
    }

    public String getRoleInFamily() {
        return roleInFamily;
    }

    public void setRoleInFamily(String roleInFamily) {
        this.roleInFamily = roleInFamily;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
