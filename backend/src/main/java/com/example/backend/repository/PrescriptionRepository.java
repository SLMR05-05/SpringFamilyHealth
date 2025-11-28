package com.example.backend.repository;

import com.example.backend.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, Integer> {
    List<Prescription> findByMemberMemberId(Integer memberId);
    
    @Query("SELECT p FROM Prescription p LEFT JOIN FETCH p.doctor LEFT JOIN FETCH p.appointment WHERE p.prescriptionId = :id")
    Prescription findByIdWithDetails(@Param("id") Integer id);
}