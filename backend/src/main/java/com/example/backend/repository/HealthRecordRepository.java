package com.example.backend.repository;

import com.example.backend.entity.HealthRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HealthRecordRepository extends JpaRepository<HealthRecord, Integer> {}
