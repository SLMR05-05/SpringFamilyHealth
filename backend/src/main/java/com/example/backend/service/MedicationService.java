package com.example.backend.service;

import com.example.backend.entity.Medication;
import com.example.backend.repository.MedicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MedicationService {
    private final MedicationRepository repo;

    public MedicationService(MedicationRepository repo) { this.repo = repo; }

    @Transactional(readOnly = true)
    public List<Medication> findAll() { return repo.findAll(); }

    @Transactional(readOnly = true)
    public Medication findById(Integer id) { return repo.findById(id).orElseThrow(() -> new NotFoundException("Medication not found: " + id)); }

    @Transactional
    public Medication create(Medication entity) { return repo.save(entity); }

    @Transactional
    public Medication update(Integer id, Medication payload) {
        Medication existing = findById(id);
        existing.setMedicationName(payload.getMedicationName());
        return repo.save(existing);
    }

    @Transactional
    public void delete(Integer id) { repo.delete(findById(id)); }
}
