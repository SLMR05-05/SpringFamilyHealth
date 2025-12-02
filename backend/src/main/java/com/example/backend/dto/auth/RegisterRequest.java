package com.example.backend.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    // Thông tin chung (bắt buộc)
    private String email;
    private String password;
    private String name;
    private String phone;
    
    // Loại đăng ký: "HEAD" (Chủ hộ), "MEMBER" (Thành viên), "DOCTOR" (Bác sĩ)
    private String registrationType;

    // Dành cho Chủ hộ (HEAD)
    private String address;

    // Dành cho Thành viên (MEMBER)
    private String inviteCode;

    // Dành cho Bác sĩ (DOCTOR)
    private String certificateNumber;
    private String specialization; // Lưu vào description
}