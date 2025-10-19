package com.example.backend.repository;

import com.example.backend.entity.VisitHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VisitHistoryRepository extends JpaRepository<VisitHistory, Integer> {}
