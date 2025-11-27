package com.example.backend.repository;

import com.example.backend.entity.DoctorApproval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DoctorApprovalRepository extends JpaRepository<DoctorApproval, Integer> {
    
    /**
     * Tìm approval theo doctor ID
     */
    Optional<DoctorApproval> findByDoctor_DoctorId(Integer doctorId);
    
    /**
     * Tìm tất cả approval theo trạng thái
     */
    List<DoctorApproval> findByStatus(String status);
    
    /**
     * Tìm tất cả approval đang chờ duyệt
     */
    @Query("SELECT da FROM DoctorApproval da WHERE da.status = 'PENDING' ORDER BY da.submittedAt DESC")
    List<DoctorApproval> findAllPending();
    
    /**
     * Kiểm tra xem doctor đã có approval chưa
     */
    boolean existsByDoctor_DoctorId(Integer doctorId);
}
