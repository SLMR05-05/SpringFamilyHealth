package com.example.backend.service;

import com.example.backend.entity.HealthRecord;
import com.example.backend.repository.HealthRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class HealthRecordService {
    private final HealthRecordRepository repo;

    public HealthRecordService(HealthRecordRepository repo) { this.repo = repo; }

    @Transactional(readOnly = true)
    public List<HealthRecord> findAll() { return repo.findAll(); }

    @Transactional(readOnly = true)
    public HealthRecord findById(Integer id) { return repo.findById(id).orElseThrow(() -> new NotFoundException("HealthRecord not found: " + id)); }

    @Transactional
    public HealthRecord create(HealthRecord entity) { return repo.save(entity); }

    @Transactional
    public HealthRecord update(Integer id, HealthRecord payload) {
        HealthRecord existing = findById(id);
        existing.setMember(payload.getMember());
        existing.setBloodType(payload.getBloodType());
        existing.setAllergies(payload.getAllergies());
        existing.setChronicConditions(payload.getChronicConditions());
        return repo.save(existing);
    }

    @Transactional
    public void delete(Integer id) { repo.delete(findById(id)); }
}
