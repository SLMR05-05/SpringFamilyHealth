package com.example.backend.service;

import com.example.backend.entity.VisitHistory;
import com.example.backend.repository.VisitHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VisitHistoryService {
    private final VisitHistoryRepository repo;

    public VisitHistoryService(VisitHistoryRepository repo) { this.repo = repo; }

    @Transactional(readOnly = true)
    public List<VisitHistory> findAll() { return repo.findAll(); }

    @Transactional(readOnly = true)
    public VisitHistory findById(Integer id) { return repo.findById(id).orElseThrow(() -> new NotFoundException("VisitHistory not found: " + id)); }

    @Transactional
    public VisitHistory create(VisitHistory entity) { return repo.save(entity); }

    @Transactional
    public VisitHistory update(Integer id, VisitHistory payload) {
        VisitHistory existing = findById(id);
        existing.setMember(payload.getMember());
        existing.setVisitDate(payload.getVisitDate());
        existing.setReason(payload.getReason());
        existing.setDiagnosis(payload.getDiagnosis());
        existing.setFollowUpDate(payload.getFollowUpDate());
        return repo.save(existing);
    }

    @Transactional
    public void delete(Integer id) { repo.delete(findById(id)); }
}
