package com.example.backend.repository;

import com.example.backend.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    
    /**
     * Tìm tất cả appointments của một bác sĩ
     */
    List<Appointment> findByDoctor_DoctorId(Integer doctorId);
    
    /**
     * Tìm tất cả appointments của một member
     */
    List<Appointment> findByMember_MemberId(Integer memberId);
    
    /**
     * Tìm appointments theo trạng thái
     */
    List<Appointment> findByStatus(String status);
    
    /**
     * Tìm appointments của bác sĩ trong khoảng thời gian
     */
    @Query("SELECT a FROM Appointment a WHERE a.doctor.doctorId = :doctorId " +
           "AND a.appointmentDate BETWEEN :startDate AND :endDate " +
           "ORDER BY a.appointmentDate ASC")
    List<Appointment> findByDoctorAndDateRange(
        @Param("doctorId") Integer doctorId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    /**
     * Tìm appointments sắp tới của bác sĩ
     */
    @Query("SELECT a FROM Appointment a WHERE a.doctor.doctorId = :doctorId " +
           "AND a.appointmentDate >= :now AND a.status = 'SCHEDULED' " +
           "ORDER BY a.appointmentDate ASC")
    List<Appointment> findUpcomingByDoctor(
        @Param("doctorId") Integer doctorId,
        @Param("now") LocalDateTime now
    );
}
