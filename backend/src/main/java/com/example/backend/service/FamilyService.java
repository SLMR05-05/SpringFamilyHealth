package com.example.backend.service;

import com.example.backend.entity.Family;
import com.example.backend.repository.FamilyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FamilyService {
    private final FamilyRepository repo;

    public FamilyService(FamilyRepository repo) { this.repo = repo; }

    @Transactional(readOnly = true)
    public List<Family> findAll() { return repo.findAll(); }

    @Transactional(readOnly = true)
    public Family findById(Integer id) { return repo.findById(id).orElseThrow(() -> new NotFoundException("Family not found: " + id)); }

    @Transactional
    public Family create(Family entity) { return repo.save(entity); }

    @Transactional
    public Family update(Integer id, Family payload) {
        Family existing = findById(id);
        existing.setDoctor(payload.getDoctor());
        existing.setAddress(payload.getAddress());
        existing.setContactNumber(payload.getContactNumber());
        return repo.save(existing);
    }

    @Transactional
    public void delete(Integer id) { repo.delete(findById(id)); }
}
