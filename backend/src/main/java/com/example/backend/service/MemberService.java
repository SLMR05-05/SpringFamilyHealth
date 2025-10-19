package com.example.backend.service;

import com.example.backend.entity.Member;
import com.example.backend.repository.MemberRepository;
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
    public Member findById(Integer id) { return repo.findById(id).orElseThrow(() -> new NotFoundException("Member not found: " + id)); }

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
        return repo.save(existing);
    }

    @Transactional
    public void delete(Integer id) { repo.delete(findById(id)); }
}
