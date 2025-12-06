package com.example.backend.repository;

import com.example.backend.entity.InviteCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InviteCodeRepository extends JpaRepository<InviteCode, Integer> {
    Optional<InviteCode> findByCode(String code);
}

