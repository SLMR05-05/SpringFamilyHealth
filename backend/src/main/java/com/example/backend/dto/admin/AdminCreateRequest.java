package com.example.backend.dto.admin;

import jakarta.validation.constraints.NotNull;

public class AdminCreateRequest {
    @NotNull(message = "userId is required")
    private Integer userId;

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
}
