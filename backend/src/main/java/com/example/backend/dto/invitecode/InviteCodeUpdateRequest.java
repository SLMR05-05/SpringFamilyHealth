package com.example.backend.dto.invitecode;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public class InviteCodeUpdateRequest {
    @NotNull
    private Integer familyId;

    @NotBlank
    private String code;

    @NotNull
    private Instant createdAt;

    private Instant expiredAt;

    public Integer getFamilyId() { return familyId; }
    public void setFamilyId(Integer familyId) { this.familyId = familyId; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getExpiredAt() { return expiredAt; }
    public void setExpiredAt(Instant expiredAt) { this.expiredAt = expiredAt; }
}
