package com.example.backend.repository;

import com.example.backend.entity.PrescriptionMedication;
import com.example.backend.entity.PrescriptionMedicationId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrescriptionMedicationRepository extends JpaRepository<PrescriptionMedication, PrescriptionMedicationId> {}
