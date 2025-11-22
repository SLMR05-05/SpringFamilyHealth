package com.example.backend.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserCreateRequest {
    @NotBlank
    @Size(max = 255)
    private String role;

    @NotBlank
    @Size(max = 255)
    private String passwordHash;

    @NotBlank
    @Size(max = 255)
    private String name;

    @Size(max = 255)
    private String phone;

    @NotBlank
    @Email
    @Size(max = 255)
    private String email;

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
