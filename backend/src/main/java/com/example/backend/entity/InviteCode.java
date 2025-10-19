package com.example.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "invite_code")
public class InviteCode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invite_id")
    private Integer inviteId;

    @ManyToOne
    @JoinColumn(name = "family_id")
    private Family family;

    @Column(name = "code", unique = true)
    private String code;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "expired_at")
    private Instant expiredAt;

    public InviteCode() {}

    public Integer getInviteId() { return inviteId; }
    public void setInviteId(Integer inviteId) { this.inviteId = inviteId; }
    public Family getFamily() { return family; }
    public void setFamily(Family family) { this.family = family; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getExpiredAt() { return expiredAt; }
    public void setExpiredAt(Instant expiredAt) { this.expiredAt = expiredAt; }
}
