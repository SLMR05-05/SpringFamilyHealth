package com.example.backend.repository;

import com.example.backend.entity.VisitHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VisitHistoryRepository extends JpaRepository<VisitHistory, Integer> {
	List<VisitHistory> findByMemberMemberId(Integer memberId);
}

