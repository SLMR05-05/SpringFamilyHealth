package com.example.backend.repository;

import com.example.backend.models.HealthRecord;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HealthRecordRepository extends JpaRepository<HealthRecord, Integer> {
    Optional<HealthRecord> findByMember_Id(Integer memberId);
}
