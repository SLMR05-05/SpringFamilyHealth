package com.example.backend.models;

import com.example.backend.models.enums.Role;

import jakarta.persistence.*;

@Entity
@Table(name = "`user`")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", length = 255)
    private Role role;

    @Column(name = "password_hash", length = 255)
    private String passwordHash;

    @Column(name = "name", length = 255)
    private String name;

    @Column(name = "phone", length = 255)
    private String phone;

    @Column(name = "email", length = 255, unique = true)
    private String email;

    @OneToOne(mappedBy = "user")
    private Admin admin;

    @OneToOne(mappedBy = "user")
    private Doctor doctor;

    @OneToOne(mappedBy = "user")
    private Member member;

    public User() {}
    // ...optional getters/setters...
}
