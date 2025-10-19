package com.example.backend.service;

import com.example.backend.entity.Admin;
import com.example.backend.repository.AdminRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {
    private final AdminRepository repo;

    public AdminService(AdminRepository repo) { this.repo = repo; }

    @Transactional(readOnly = true)
    public List<Admin> findAll() { return repo.findAll(); }

    @Transactional(readOnly = true)
    public Admin findById(Integer id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("Admin not found: " + id));
    }

    @Transactional
    public Admin create(Admin entity) { return repo.save(entity); }

    @Transactional
    public Admin update(Integer id, Admin payload) {
        Admin existing = findById(id);
        // For Admin, only linkage to user; keep same id and user
        existing.setUser(payload.getUser());
        return repo.save(existing);
    }

    @Transactional
    public void delete(Integer id) { repo.delete(findById(id)); }
}
