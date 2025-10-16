package com.example.backend.repository;

import com.example.backend.models.InviteCode;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InviteCodeRepository extends JpaRepository<InviteCode, Integer> {
    Optional<InviteCode> findByCode(String code);
    List<InviteCode> findByFamily_Id(Integer familyId);
}
