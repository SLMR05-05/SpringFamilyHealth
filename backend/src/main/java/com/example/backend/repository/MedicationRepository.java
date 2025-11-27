package com.example.backend.repository;

import com.example.backend.entity.Medication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MedicationRepository extends JpaRepository<Medication, Integer> {
    Optional<Medication> findByMedicationName(String medicationName);
}

