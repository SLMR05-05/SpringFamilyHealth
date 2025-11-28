package com.example.backend.repository;

import com.example.backend.entity.PrescriptionMedication;
import com.example.backend.entity.PrescriptionMedicationId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrescriptionMedicationRepository extends JpaRepository<PrescriptionMedication, PrescriptionMedicationId> {
    List<PrescriptionMedication> findByPrescriptionPrescriptionId(Integer prescriptionId);
}

