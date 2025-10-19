package com.example.backend.service;

import com.example.backend.entity.Prescription;
import com.example.backend.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PrescriptionService {
    private final PrescriptionRepository repo;

    public PrescriptionService(PrescriptionRepository repo) { this.repo = repo; }

    @Transactional(readOnly = true)
    public List<Prescription> findAll() { return repo.findAll(); }

    @Transactional(readOnly = true)
    public Prescription findById(Integer id) { return repo.findById(id).orElseThrow(() -> new NotFoundException("Prescription not found: " + id)); }

    @Transactional
    public Prescription create(Prescription entity) { return repo.save(entity); }

    @Transactional
    public Prescription update(Integer id, Prescription payload) {
        Prescription existing = findById(id);
        existing.setMember(payload.getMember());
        existing.setVisit(payload.getVisit());
        existing.setNote(payload.getNote());
        return repo.save(existing);
    }

    @Transactional
    public void delete(Integer id) { repo.delete(findById(id)); }
}
