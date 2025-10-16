package com.example.backend.repository;

import com.example.backend.models.Member;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRepository extends JpaRepository<Member, Integer> {
    List<Member> findByFamily_Id(Integer familyId);
    Optional<Member> findByUser_Email(String email);
}
