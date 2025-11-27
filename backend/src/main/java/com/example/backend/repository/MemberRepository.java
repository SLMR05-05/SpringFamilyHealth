package com.example.backend.repository;

import com.example.backend.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MemberRepository extends JpaRepository<Member, Integer> {
    
    /**
     * Tìm tất cả members thuộc các families do một doctor cụ thể quản lý
     * Sử dụng JOIN FETCH để load User cùng lúc và tránh N+1 query problem
     */
    @Query("SELECT DISTINCT m FROM Member m " +
           "LEFT JOIN FETCH m.user " +
           "WHERE m.family.doctor.doctorId = :doctorId")
    List<Member> findAllByDoctorId(@Param("doctorId") Integer doctorId);
}

