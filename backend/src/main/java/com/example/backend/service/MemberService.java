package com.example.backend.service;

import com.example.backend.entity.Member;
import com.example.backend.repository.MemberRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MemberService {
    private final MemberRepository repo;

    public MemberService(MemberRepository repo) { this.repo = repo; }

    @Transactional(readOnly = true)
    public List<Member> findAll() { return repo.findAll(); }

    @Transactional(readOnly = true)
    public Page<Member> findAll(Pageable pageable) { return repo.findAll(pageable); }

    @Transactional(readOnly = true)
    public Member findById(Integer id) { return repo.findById(id).orElseThrow(() -> new NotFoundException("Member not found: " + id)); }

    @Transactional(readOnly = true)
    public Member findByUserId(Integer userId) { return repo.findByUserId(userId).orElseThrow(() -> new NotFoundException("Member not found for user: " + userId)); }

    @Transactional
    public Member create(Member entity) { return repo.save(entity); }

    @Transactional
    public Member update(Integer id, Member payload) {
        Member existing = findById(id);
        existing.setUser(payload.getUser());
        existing.setFamily(payload.getFamily());
        existing.setAge(payload.getAge());
        existing.setDayOfBirth(payload.getDayOfBirth());
        existing.setGender(payload.getGender());
        existing.setWeight(payload.getWeight());
        existing.setHeight(payload.getHeight());
        existing.setRelationship(payload.getRelationship());
        existing.setRoleInFamily(payload.getRoleInFamily());
        existing.setPhone(payload.getPhone());
        existing.setEmail(payload.getEmail());
        existing.setAddress(payload.getAddress());
        return repo.save(existing);
    }

    @Transactional
    public void delete(Integer id) { repo.delete(findById(id)); }

    /**
     * Lấy tất cả bệnh nhân (members) thuộc các gia đình do bác sĩ cụ thể quản lý
     */
    @Transactional(readOnly = true)
    public List<Member> findAllByDoctorId(Integer doctorId) {
        return repo.findAllByDoctorId(doctorId);
    }
}
