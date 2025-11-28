package com.example.backend.repository;

import com.example.backend.entity.HealthRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface HealthRecordRepository extends JpaRepository<HealthRecord, Integer> {
	Optional<HealthRecord> findByMemberMemberId(Integer memberId);
}

