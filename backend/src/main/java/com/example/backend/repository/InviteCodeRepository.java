package com.example.backend.repository;

import com.example.backend.entity.InviteCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

public interface InviteCodeRepository extends JpaRepository<InviteCode, Integer> {
    // Tìm mã mời chính xác để xác định gia đình
    Optional<InviteCode> findByCode(String code);
}

