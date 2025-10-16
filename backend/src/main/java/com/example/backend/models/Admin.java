package com.example.backend.models;

import jakarta.persistence.*;

@Entity
@Table(name = "admin")
public class Admin {
    @Id
    @Column(name = "admin_id")
    private Integer id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "admin_id")
    private User user;

    public Admin() {}
    // ...getters/setters if needed...
}
