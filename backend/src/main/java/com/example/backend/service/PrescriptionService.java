package com.example.backend.service;

import com.example.backend.entity.Prescription;
import com.example.backend.repository.PrescriptionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    public Page<Prescription> findAll(Pageable pageable) { return repo.findAll(pageable); }

    @Transactional(readOnly = true)
    public Prescription findById(Integer id) { return repo.findById(id).orElseThrow(() -> new NotFoundException("Prescription not found: " + id)); }

    @Transactional(readOnly = true)
    public Prescription findByIdWithDetails(Integer id) { 
        Prescription prescription = repo.findByIdWithDetails(id);
        if (prescription == null) {
            throw new NotFoundException("Prescription not found: " + id);
        }
        return prescription;
    }

    @Transactional(readOnly = true)
    public List<Prescription> findByMemberId(Integer memberId) {
        return repo.findByMemberMemberId(memberId);
    }

    @Transactional
    public Prescription create(Prescription entity) { return repo.save(entity); }

    @Transactional
    public Prescription update(Integer id, Prescription payload) {
        Prescription existing = findById(id);
        existing.setMember(payload.getMember());
        existing.setAppointment(payload.getAppointment());
        existing.setDoctor(payload.getDoctor());
        existing.setNote(payload.getNote());
        existing.setStatus(payload.getStatus());
        existing.setPrescribedAt(payload.getPrescribedAt());
        return repo.save(existing);
    }

    @Transactional
    public void delete(Integer id) { repo.delete(findById(id)); }
}
