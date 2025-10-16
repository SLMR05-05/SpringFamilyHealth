package com.example.backend.repository;

import com.example.backend.models.Medication;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicationRepository extends JpaRepository<Medication, Integer> {
    List<Medication> findByMedicationNameContainingIgnoreCase(String medicationName);
}
