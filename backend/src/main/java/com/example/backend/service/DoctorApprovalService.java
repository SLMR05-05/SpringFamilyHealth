package com.example.backend.service;

import com.example.backend.entity.DoctorApproval;
import com.example.backend.repository.DoctorApprovalRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DoctorApprovalService {
    private final DoctorApprovalRepository repo;

    public DoctorApprovalService(DoctorApprovalRepository repo) {
        this.repo = repo;
    }

    @Transactional(readOnly = true)
    public List<DoctorApproval> findAll() {
        return repo.findAll();
    }

    @Transactional(readOnly = true)
    public DoctorApproval findById(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("DoctorApproval not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<DoctorApproval> findAllPending() {
        return repo.findAllPending();
    }

    @Transactional(readOnly = true)
    public DoctorApproval findByDoctorId(Integer doctorId) {
        return repo.findByDoctor_DoctorId(doctorId)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public List<DoctorApproval> findByStatus(String status) {
        return repo.findByStatus(status);
    }

    @Transactional
    public DoctorApproval create(DoctorApproval entity) {
        return repo.save(entity);
    }

    @Transactional
    public DoctorApproval approve(Integer id, Integer reviewerId) {
        DoctorApproval approval = findById(id);
        approval.setStatus("APPROVED");
        approval.setReviewedAt(LocalDateTime.now());
        // reviewedBy will be set by controller
        return repo.save(approval);
    }

    @Transactional
    public DoctorApproval reject(Integer id, Integer reviewerId, String reason) {
        DoctorApproval approval = findById(id);
        approval.setStatus("REJECTED");
        approval.setReviewedAt(LocalDateTime.now());
        approval.setRejectionReason(reason);
        // reviewedBy will be set by controller
        return repo.save(approval);
    }

    @Transactional
    public void delete(Integer id) {
        repo.delete(findById(id));
    }
}
