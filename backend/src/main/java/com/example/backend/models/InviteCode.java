package com.example.backend.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "invite_code")
public class InviteCode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invite_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "family_id")
    private FamilyEntity family;

    @Column(name = "code", unique = true)
    private String code;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "expired_at")
    private LocalDateTime expiredAt;

    public InviteCode() {}
    // ...getters/setters if needed...
}
