package com.example.backend.repository;

import com.example.backend.models.VisitHistory;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VisitHistoryRepository extends JpaRepository<VisitHistory, Integer> {
    List<VisitHistory> findByMember_Id(Integer memberId);
    List<VisitHistory> findByMember_IdAndVisitDateBetween(Integer memberId, LocalDate start, LocalDate end);
}
