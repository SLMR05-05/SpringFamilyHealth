package com.example.backend.service;

import com.example.backend.entity.Doctor;
import com.example.backend.repository.DoctorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DoctorService {
    private final DoctorRepository repo;

    public DoctorService(DoctorRepository repo) { this.repo = repo; }

    @Transactional(readOnly = true)
    public List<Doctor> findAll() { return repo.findAll(); }

    @Transactional(readOnly = true)
    public Doctor findById(Integer id) { return repo.findById(id).orElseThrow(() -> new NotFoundException("Doctor not found: " + id)); }

    @Transactional
    public Doctor create(Doctor entity) { return repo.save(entity); }

    @Transactional
    public Doctor update(Integer id, Doctor payload) {
        Doctor existing = findById(id);
        existing.setUser(payload.getUser());
        existing.setCertificateNumber(payload.getCertificateNumber());
        existing.setDescription(payload.getDescription());
        return repo.save(existing);
    }

    @Transactional
    public void delete(Integer id) { repo.delete(findById(id)); }
}
