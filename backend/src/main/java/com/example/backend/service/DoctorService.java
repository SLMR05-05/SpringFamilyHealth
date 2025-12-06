package com.example.backend.service;

import com.example.backend.entity.Doctor;
import com.example.backend.repository.DoctorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    public Page<Doctor> findAll(Pageable pageable) { return repo.findAll(pageable); }

    @Transactional(readOnly = true)
    public Doctor findById(Integer id) { return repo.findById(id).orElseThrow(() -> new NotFoundException("Doctor not found: " + id)); }

    @Transactional
    public Doctor create(Doctor entity) { return repo.save(entity); }

    @Transactional
    public Doctor update(Integer id, Doctor payload) {
        Doctor existing = findById(id);
        existing.setUser(payload.getUser());
        existing.setCertificateNumber(payload.getCertificateNumber());
        
        // Update additional fields
        if (payload.getSpecialization() != null) {
            existing.setSpecialization(payload.getSpecialization());
        }
        if (payload.getAddress() != null) {
            existing.setAddress(payload.getAddress());
        }
        if (payload.getClinicName() != null) {
            existing.setClinicName(payload.getClinicName());
        }
        if (payload.getYearsOfExperience() != null) {
            existing.setYearsOfExperience(payload.getYearsOfExperience());
        }
        if (payload.getEducation() != null) {
            existing.setEducation(payload.getEducation());
        }
        if (payload.getLanguagesSpoken() != null) {
            existing.setLanguagesSpoken(payload.getLanguagesSpoken());
        }
        if (payload.getConsultationFee() != null) {
            existing.setConsultationFee(payload.getConsultationFee());
        }
        
        return repo.save(existing);
    }

    @Transactional
    public void delete(Integer id) { repo.delete(findById(id)); }
}
