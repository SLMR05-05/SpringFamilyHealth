package com.example.backend.service;

import com.example.backend.entity.PrescriptionMedication;
import com.example.backend.entity.PrescriptionMedicationId;
import com.example.backend.repository.PrescriptionMedicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PrescriptionMedicationService {
    private final PrescriptionMedicationRepository repo;

    public PrescriptionMedicationService(PrescriptionMedicationRepository repo) { this.repo = repo; }

    @Transactional(readOnly = true)
    public List<PrescriptionMedication> findAll() { return repo.findAll(); }

    @Transactional(readOnly = true)
    public PrescriptionMedication findById(PrescriptionMedicationId id) { return repo.findById(id).orElseThrow(() -> new NotFoundException("PrescriptionMedication not found")); }

    @Transactional
    public PrescriptionMedication create(PrescriptionMedication entity) { return repo.save(entity); }

    @Transactional
    public PrescriptionMedication update(PrescriptionMedicationId id, PrescriptionMedication payload) {
        PrescriptionMedication existing = findById(id);
        existing.setPrescription(payload.getPrescription());
        existing.setMedication(payload.getMedication());
        existing.setDosage(payload.getDosage());
        existing.setDuration(payload.getDuration());
        return repo.save(existing);
    }

    @Transactional
    public void delete(PrescriptionMedicationId id) { repo.delete(findById(id)); }
}
