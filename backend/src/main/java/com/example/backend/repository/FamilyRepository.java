package com.example.backend.repository;

import com.example.backend.entity.Family;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FamilyRepository extends JpaRepository<Family, Integer> {
    // Tìm tất cả gia đình theo doctor ID
    List<Family> findByDoctor_DoctorId(Integer doctorId);
}
