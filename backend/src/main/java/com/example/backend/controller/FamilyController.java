package com.example.backend.controller;

import com.example.backend.dto.family.FamilyCreateRequest;
import com.example.backend.dto.family.FamilyUpdateRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.FamilyResponse;
import com.example.backend.dto.response.FamilyDashboardResponse;
import com.example.backend.entity.*;
import com.example.backend.service.*;
import com.example.backend.repository.*;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/families")
@CrossOrigin
public class FamilyController {
    private final FamilyService service;
    private final DoctorService doctorService;
    private final MemberRepository memberRepository;
    private final AppointmentRepository appointmentRepository;
    private final NotificationService notificationService;
    private final HealthRecordRepository healthRecordRepository;
    private final VisitHistoryRepository visitHistoryRepository;
    
    public FamilyController(FamilyService service, DoctorService doctorService,
                          MemberRepository memberRepository,
                          AppointmentRepository appointmentRepository,
                          NotificationService notificationService,
                          HealthRecordRepository healthRecordRepository,
                          VisitHistoryRepository visitHistoryRepository) {
        this.service = service;
        this.doctorService = doctorService;
        this.memberRepository = memberRepository;
        this.appointmentRepository = appointmentRepository;
        this.notificationService = notificationService;
        this.healthRecordRepository = healthRecordRepository;
        this.visitHistoryRepository = visitHistoryRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ApiResponse<Page<FamilyResponse>> getAll(Pageable pageable) {
        return ApiResponse.<Page<FamilyResponse>>builder()
                .result(service.findAll(pageable).map(this::toResponse))
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ApiResponse<FamilyResponse> getById(@PathVariable Integer id) {
        return ApiResponse.<FamilyResponse>builder()
                .result(toResponse(service.findById(id)))
                .build();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<FamilyResponse> create(@Valid @RequestBody FamilyCreateRequest req) {
        Family entity = new Family();
        entity.setDoctor(doctorService.findById(req.getDoctorId()));
        entity.setAddress(req.getAddress());
        entity.setContactNumber(req.getContactNumber());
        Family created = service.create(entity);
        return ApiResponse.<FamilyResponse>builder()
                .result(toResponse(created))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<FamilyResponse> update(@PathVariable Integer id, @Valid @RequestBody FamilyUpdateRequest req) {
        Family payload = new Family();
        payload.setDoctor(doctorService.findById(req.getDoctorId()));
        payload.setAddress(req.getAddress());
        payload.setContactNumber(req.getContactNumber());
        return ApiResponse.<FamilyResponse>builder()
                .result(toResponse(service.update(id, payload)))
                .build();
    }

    @GetMapping("/{id}/dashboard")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ApiResponse<FamilyDashboardResponse> getDashboard(@PathVariable Integer id) {
        Family family = service.findById(id);
        FamilyDashboardResponse response = new FamilyDashboardResponse();
        
        // Family Info
        FamilyDashboardResponse.FamilyInfo familyInfo = new FamilyDashboardResponse.FamilyInfo();
        familyInfo.setFamilyId(family.getFamilyId());
        familyInfo.setAddress(family.getAddress());
        familyInfo.setContactNumber(family.getContactNumber());
        if (family.getDoctor() != null && family.getDoctor().getUser() != null) {
            familyInfo.setDoctorName(family.getDoctor().getUser().getName());
        }
        response.setFamily(familyInfo);
        
        // Members Info
        List<Member> members = memberRepository.findAll().stream()
            .filter(m -> m.getFamily() != null && m.getFamily().getFamilyId().equals(id))
            .collect(Collectors.toList());
            
        List<FamilyDashboardResponse.MemberInfo> memberInfos = new ArrayList<>();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        
        for (Member m : members) {
            FamilyDashboardResponse.MemberInfo mi = new FamilyDashboardResponse.MemberInfo();
            mi.setMemberId(m.getMemberId());
            
            // Basic info from User
            if (m.getUser() != null) {
                mi.setName(m.getUser().getName());
            }
            
            // Member specific info
            mi.setAge(m.getAge());
            if (m.getDayOfBirth() != null) {
                mi.setDayOfBirth(m.getDayOfBirth().format(dateFormatter));
            }
            mi.setGender(m.getGender());
            mi.setRoleInFamily(m.getRoleInFamily());
            mi.setRelationship(m.getRelationship());
            mi.setPhone(m.getPhone());
            mi.setEmail(m.getEmail());
            mi.setAddress(m.getAddress());
            mi.setWeight(m.getWeight());
            mi.setHeight(m.getHeight());
            
            // Get health record
            healthRecordRepository.findAll().stream()
                .filter(hr -> hr.getMember() != null && hr.getMember().getMemberId().equals(m.getMemberId()))
                .findFirst()
                .ifPresent(hr -> {
                    mi.setBloodType(hr.getBloodType());
                    mi.setAllergies(hr.getAllergies());
                    mi.setChronicConditions(hr.getChronicConditions());
                });
            
            // Get last visit
            visitHistoryRepository.findAll().stream()
                .filter(vh -> vh.getMember() != null && vh.getMember().getMemberId().equals(m.getMemberId()))
                .max((v1, v2) -> v1.getVisitDate().compareTo(v2.getVisitDate()))
                .ifPresent(vh -> mi.setLastVisit(vh.getVisitDate().format(dateFormatter)));
            
            // Set status based on chronic conditions
            mi.setStatus(mi.getChronicConditions() != null && !mi.getChronicConditions().isEmpty() && !"Không".equals(mi.getChronicConditions()) ? "Attention" : "Healthy");
            memberInfos.add(mi);
        }
        response.setMembers(memberInfos);
        
        // Statistics
        FamilyDashboardResponse.StatisticsInfo stats = new FamilyDashboardResponse.StatisticsInfo();
        stats.setTotalMembers(members.size());
        stats.setHealthyMembers((int) memberInfos.stream().filter(mi -> "Healthy".equals(mi.getStatus())).count());
        stats.setNeedAttention((int) memberInfos.stream().filter(mi -> "Attention".equals(mi.getStatus())).count());
        
        // Get upcoming appointments
        List<Appointment> upcomingAppts = appointmentRepository.findAll().stream()
            .filter(a -> a.getMember() != null && 
                        a.getMember().getFamily() != null && 
                        a.getMember().getFamily().getFamilyId().equals(id) &&
                        a.getAppointmentDate().isAfter(LocalDateTime.now()))
            .sorted((a1, a2) -> a1.getAppointmentDate().compareTo(a2.getAppointmentDate()))
            .limit(5)
            .collect(Collectors.toList());
            
        stats.setUpcomingAppointments(upcomingAppts.size());
        
        List<FamilyDashboardResponse.AppointmentInfo> apptInfos = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        for (Appointment a : upcomingAppts) {
            FamilyDashboardResponse.AppointmentInfo ai = new FamilyDashboardResponse.AppointmentInfo();
            ai.setAppointmentId(a.getAppointmentId());
            ai.setTitle(a.getReason());
            if (a.getMember() != null && a.getMember().getUser() != null) {
                ai.setPatientName(a.getMember().getUser().getName());
            }
            ai.setDate(a.getAppointmentDate().format(formatter));
            if (a.getDoctor() != null && a.getDoctor().getUser() != null) {
                ai.setDoctorName(a.getDoctor().getUser().getName());
            }
            ai.setStatus(a.getStatus());
            apptInfos.add(ai);
        }
        response.setUpcomingAppointments(apptInfos);
        
        // Get notifications for family members
        List<Integer> memberUserIds = members.stream()
            .filter(m -> m.getUser() != null)
            .map(m -> m.getUser().getUserId())
            .collect(Collectors.toList());
            
        List<Notification> notifications = new ArrayList<>();
        for (Integer userId : memberUserIds) {
            notifications.addAll(notificationService.findByUserId(userId));
        }
        notifications.sort((n1, n2) -> n2.getCreatedAt().compareTo(n1.getCreatedAt()));
        notifications = notifications.stream().limit(5).collect(Collectors.toList());
        
        long unreadCount = notifications.stream().filter(n -> !n.getIsRead()).count();
        stats.setUnreadNotifications((int) unreadCount);
        response.setStatistics(stats);
        
        List<FamilyDashboardResponse.NotificationInfo> notifInfos = new ArrayList<>();
        for (Notification n : notifications) {
            FamilyDashboardResponse.NotificationInfo ni = new FamilyDashboardResponse.NotificationInfo();
            ni.setNotificationId(n.getNotificationId());
            ni.setTitle(n.getTitle());
            ni.setMessage(n.getMessage());
            ni.setDate(n.getCreatedAt().format(formatter));
            ni.setPriority(n.getType() != null && n.getType().contains("urgent") ? "high" : "medium");
            notifInfos.add(ni);
        }
        response.setRecentNotifications(notifInfos);
        
        return ApiResponse.<FamilyDashboardResponse>builder()
                .result(response)
                .build();
    }

    @GetMapping("/{id}/medical-records")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ApiResponse<List<FamilyDashboardResponse.MedicalRecordInfo>> getMedicalRecords(@PathVariable Integer id) {
        Family family = service.findById(id);
        
        // Get all members of the family
        List<Member> members = memberRepository.findAll().stream()
            .filter(m -> m.getFamily() != null && m.getFamily().getFamilyId().equals(id))
            .collect(Collectors.toList());
        
        List<FamilyDashboardResponse.MedicalRecordInfo> records = new ArrayList<>();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        
        // Get visit histories for each member
        for (Member member : members) {
            List<VisitHistory> visits = visitHistoryRepository.findAll().stream()
                .filter(vh -> vh.getMember() != null && vh.getMember().getMemberId().equals(member.getMemberId()))
                .sorted((v1, v2) -> v2.getVisitDate().compareTo(v1.getVisitDate()))
                .collect(Collectors.toList());
            
            for (VisitHistory visit : visits) {
                FamilyDashboardResponse.MedicalRecordInfo record = new FamilyDashboardResponse.MedicalRecordInfo();
                record.setRecordId(visit.getVisitId());
                record.setType("visit");
                record.setTitle(visit.getReason() != null ? visit.getReason() : "Khám bệnh");
                
                if (member.getUser() != null) {
                    record.setPatientName(member.getUser().getName());
                }
                
                record.setDate(visit.getVisitDate().format(dateFormatter));
                record.setDiagnosis(visit.getDiagnosis());
                
                if (visit.getFollowUpDate() != null) {
                    record.setFollowUpDate(visit.getFollowUpDate().format(dateFormatter));
                }
                
                // Determine status based on follow-up date
                if (visit.getFollowUpDate() != null && visit.getFollowUpDate().isAfter(java.time.LocalDate.now())) {
                    record.setStatus("upcoming");
                } else {
                    record.setStatus("completed");
                }
                
                records.add(record);
            }
        }
        
        // Sort all records by date (most recent first)
        records.sort((r1, r2) -> {
            try {
                java.time.LocalDate d1 = java.time.LocalDate.parse(r1.getDate(), dateFormatter);
                java.time.LocalDate d2 = java.time.LocalDate.parse(r2.getDate(), dateFormatter);
                return d2.compareTo(d1);
            } catch (Exception e) {
                return 0;
            }
        });
        
        return ApiResponse.<List<FamilyDashboardResponse.MedicalRecordInfo>>builder()
                .result(records)
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ApiResponse.<Void>builder().build();
    }

    private FamilyResponse toResponse(Family f) {
        FamilyResponse res = new FamilyResponse();
        res.setFamilyId(f.getFamilyId());
        res.setDoctorId(f.getDoctor() != null ? f.getDoctor().getDoctorId() : null);
        res.setAddress(f.getAddress());
        res.setContactNumber(f.getContactNumber());
        return res;
    }
}
