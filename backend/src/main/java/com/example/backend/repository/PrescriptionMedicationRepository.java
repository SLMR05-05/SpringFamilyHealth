package com.example.backend.repository;

import com.example.backend.models.PrescriptionMedication;
import com.example.backend.models.PrescriptionMedicationId;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrescriptionMedicationRepository extends JpaRepository<PrescriptionMedication, PrescriptionMedicationId> {
    List<PrescriptionMedication> findByPrescription_Id(Integer prescriptionId);
    List<PrescriptionMedication> findByMedication_Id(Integer medicationId);
}
