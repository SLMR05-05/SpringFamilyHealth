package com.example.backend.service;

import com.example.backend.entity.Vaccination;
import com.example.backend.repository.VaccinationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VaccinationService {
    private final VaccinationRepository repo;

    public VaccinationService(VaccinationRepository repo) { this.repo = repo; }

    @Transactional(readOnly = true)
    public List<Vaccination> findAll() { return repo.findAll(); }

    @Transactional(readOnly = true)
    public Vaccination findById(Integer id) { return repo.findById(id).orElseThrow(() -> new NotFoundException("Vaccination not found: " + id)); }

    @Transactional
    public Vaccination create(Vaccination entity) { return repo.save(entity); }

    @Transactional
    public Vaccination update(Integer id, Vaccination payload) {
        Vaccination existing = findById(id);
        existing.setMember(payload.getMember());
        existing.setVaccineName(payload.getVaccineName());
        existing.setDateGiven(payload.getDateGiven());
        return repo.save(existing);
    }

    @Transactional
    public void delete(Integer id) { repo.delete(findById(id)); }
}
