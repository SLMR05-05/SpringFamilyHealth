package com.example.backend.repository;

import com.example.backend.entity.DoctorRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRequestRepository extends JpaRepository<DoctorRequest, Integer> {
    
    // Find all requests for a specific doctor
    Page<DoctorRequest> findByDoctor_DoctorId(Integer doctorId, Pageable pageable);
    
    // Find all requests for a specific doctor with status filter
    Page<DoctorRequest> findByDoctor_DoctorIdAndStatus(Integer doctorId, DoctorRequest.RequestStatus status, Pageable pageable);
    
    // Find all requests from a specific user
    List<DoctorRequest> findByUser_UserId(Integer userId);
    
    // Find all requests for a family
    List<DoctorRequest> findByFamily_FamilyId(Integer familyId);
    
    // Count pending requests for a doctor
    long countByDoctor_DoctorIdAndStatus(Integer doctorId, DoctorRequest.RequestStatus status);
}
