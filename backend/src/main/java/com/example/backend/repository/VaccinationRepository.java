package com.example.backend.repository;

import com.example.backend.entity.Vaccination;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VaccinationRepository extends JpaRepository<Vaccination, Integer> {
	List<Vaccination> findByMemberMemberId(Integer memberId);
}

