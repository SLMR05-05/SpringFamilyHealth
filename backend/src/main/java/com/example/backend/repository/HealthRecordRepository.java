package com.example.backend.repository;

import com.example.backend.entity.HealthRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface HealthRecordRepository extends JpaRepository<HealthRecord, Integer> {
	// Find all health records for a member (returns list to handle duplicates)
	List<HealthRecord> findByMember_MemberId(Integer memberId);
	
	// Get the first health record for a member (ordered by recordId)
	@Query(value = "SELECT * FROM health_record WHERE member_id = ?1 ORDER BY record_id ASC LIMIT 1", nativeQuery = true)
	Optional<HealthRecord> findByMemberMemberId(Integer memberId);
}

