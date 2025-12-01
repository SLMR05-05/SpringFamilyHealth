package com.example.backend.service;

import com.example.backend.entity.Doctor;
import com.example.backend.entity.Vaccination;
import com.example.backend.repository.DoctorRepository;
import com.example.backend.repository.VaccinationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VaccinationService {
    private final VaccinationRepository repo;
    private final DoctorRepository doctorRepository;

    public VaccinationService(VaccinationRepository repo, DoctorRepository doctorRepository) {
        this.repo = repo;
        this.doctorRepository = doctorRepository;
    }

    @Transactional(readOnly = true)
    public List<Vaccination> findAll() { return repo.findAll(); }

    @Transactional(readOnly = true)
    public Page<Vaccination> findAll(Pageable pageable) { return repo.findAll(pageable); }

    @Transactional(readOnly = true)
    public java.util.List<Vaccination> findByMemberId(Integer memberId) {
        return repo.findByMemberMemberId(memberId);
    }

    @Transactional(readOnly = true)
    public Vaccination findById(Integer id) { return repo.findById(id).orElseThrow(() -> new NotFoundException("Vaccination not found: " + id)); }

    @Transactional
    public Vaccination create(Vaccination entity) { return repo.save(entity); }

    @Transactional
    public Vaccination update(Integer id, Vaccination payload) {
        Vaccination existing = findById(id);
        existing.setMember(payload.getMember());
        if (payload.getDoctor() != null) {
            existing.setDoctor(payload.getDoctor());
        }
        existing.setVaccineName(payload.getVaccineName());
        existing.setDateGiven(payload.getDateGiven());
        existing.setNextDose(payload.getNextDose());
        existing.setLocation(payload.getLocation());
        existing.setNotes(payload.getNotes());
        return repo.save(existing);
    }

    @Transactional
    public void delete(Integer id) { repo.delete(findById(id)); }

    @Transactional(readOnly = true)
    public Doctor findDoctorById(Integer doctorId) {
        return doctorRepository.findById(doctorId)
                .orElseThrow(() -> new NotFoundException("Doctor not found: " + doctorId));
    }
}
