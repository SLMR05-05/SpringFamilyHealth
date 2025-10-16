package com.example.backend.repository;

import com.example.backend.models.FamilyEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FamilyEntityRepository extends JpaRepository<FamilyEntity, Integer> {
    List<FamilyEntity> findByDoctor_Id(Integer doctorId);
    List<FamilyEntity> findByAddressContainingIgnoreCase(String address);
}
