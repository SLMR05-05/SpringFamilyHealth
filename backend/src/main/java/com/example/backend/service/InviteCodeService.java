package com.example.backend.service;

import com.example.backend.entity.InviteCode;
import com.example.backend.repository.InviteCodeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InviteCodeService {
    private final InviteCodeRepository repo;

    public InviteCodeService(InviteCodeRepository repo) { this.repo = repo; }

    @Transactional(readOnly = true)
    public List<InviteCode> findAll() { return repo.findAll(); }

    @Transactional(readOnly = true)
    public InviteCode findById(Integer id) { return repo.findById(id).orElseThrow(() -> new NotFoundException("InviteCode not found: " + id)); }

    @Transactional
    public InviteCode create(InviteCode entity) { return repo.save(entity); }

    @Transactional
    public InviteCode update(Integer id, InviteCode payload) {
        InviteCode existing = findById(id);
        existing.setFamily(payload.getFamily());
        existing.setCode(payload.getCode());
        existing.setCreatedAt(payload.getCreatedAt());
        existing.setExpiredAt(payload.getExpiredAt());
        return repo.save(existing);
    }

    @Transactional
    public void delete(Integer id) { repo.delete(findById(id)); }
}
