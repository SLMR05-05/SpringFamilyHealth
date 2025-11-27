package com.example.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "admin")
public class Admin {

    @Id
    @Column(name = "admin_id")
    private Integer adminId; // Shared PK with User

    @OneToOne
    @MapsId
    @JoinColumn(name = "admin_id")
    private User user;

    public Admin() {}

    public Integer getAdminId() {
        return adminId;
    }

    public void setAdminId(Integer adminId) {
        this.adminId = adminId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
