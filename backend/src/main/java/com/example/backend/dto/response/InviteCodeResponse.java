package com.example.backend.dto.response;

import java.time.Instant;

public class InviteCodeResponse {
    private Integer inviteId;
    private Integer familyId;
    private String code;
    private Instant createdAt;
    private Instant expiredAt;

    public Integer getInviteId() { return inviteId; }
    public void setInviteId(Integer inviteId) { this.inviteId = inviteId; }
    public Integer getFamilyId() { return familyId; }
    public void setFamilyId(Integer familyId) { this.familyId = familyId; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getExpiredAt() { return expiredAt; }
    public void setExpiredAt(Instant expiredAt) { this.expiredAt = expiredAt; }
}
