package com.example.backend.repository;

import com.example.backend.models.Prescription;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Integer> {
    List<Prescription> findByMember_Id(Integer memberId);
    List<Prescription> findByVisit_Id(Integer visitId);
}
