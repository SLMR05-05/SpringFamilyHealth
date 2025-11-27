package com.example.backend.service;

import com.example.backend.entity.Appointment;
import com.example.backend.repository.AppointmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppointmentService {
    private final AppointmentRepository repo;

    public AppointmentService(AppointmentRepository repo) {
        this.repo = repo;
    }

    @Transactional(readOnly = true)
    public List<Appointment> findAll() {
        return repo.findAll();
    }

    @Transactional(readOnly = true)
    public Appointment findById(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Appointment not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<Appointment> findByDoctorId(Integer doctorId) {
        return repo.findByDoctor_DoctorId(doctorId);
    }

    @Transactional(readOnly = true)
    public List<Appointment> findByMemberId(Integer memberId) {
        return repo.findByMember_MemberId(memberId);
    }

    @Transactional(readOnly = true)
    public List<Appointment> findUpcomingByDoctor(Integer doctorId) {
        return repo.findUpcomingByDoctor(doctorId, LocalDateTime.now());
    }

    @Transactional(readOnly = true)
    public List<Appointment> findByDoctorAndDateRange(Integer doctorId, LocalDateTime startDate, LocalDateTime endDate) {
        return repo.findByDoctorAndDateRange(doctorId, startDate, endDate);
    }

    @Transactional
    public Appointment create(Appointment entity) {
        return repo.save(entity);
    }

    @Transactional
    public Appointment update(Integer id, Appointment payload) {
        Appointment existing = findById(id);
        existing.setAppointmentDate(payload.getAppointmentDate());
        existing.setStatus(payload.getStatus());
        existing.setReason(payload.getReason());
        existing.setNotes(payload.getNotes());
        return repo.save(existing);
    }

    @Transactional
    public Appointment updateStatus(Integer id, String status) {
        Appointment existing = findById(id);
        existing.setStatus(status);
        return repo.save(existing);
    }

    @Transactional
    public void delete(Integer id) {
        repo.delete(findById(id));
    }
}
