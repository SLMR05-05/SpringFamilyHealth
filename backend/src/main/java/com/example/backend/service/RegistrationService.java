package com.example.backend.service;

import com.example.backend.dto.auth.RegisterRequest;
import com.example.backend.dto.auth.RegisterResponse;
import com.example.backend.entity.Doctor;
import com.example.backend.entity.Family;
import com.example.backend.entity.HealthRecord;
import com.example.backend.entity.InviteCode;
import com.example.backend.entity.Member;
import com.example.backend.entity.User;
import com.example.backend.repository.DoctorRepository;
import com.example.backend.repository.FamilyRepository;
import com.example.backend.repository.HealthRecordRepository;
import com.example.backend.repository.InviteCodeRepository;
import com.example.backend.repository.MemberRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class RegistrationService {
    private final UserRepository userRepository;
    private final FamilyRepository familyRepository;
    private final MemberRepository memberRepository;
    private final InviteCodeRepository inviteCodeRepository;
    private final DoctorRepository doctorRepository;
    private final HealthRecordRepository healthRecordRepository;
    private final PasswordEncoder passwordEncoder;

    public RegistrationService(UserRepository userRepository,
                                FamilyRepository familyRepository,
                                MemberRepository memberRepository,
                                InviteCodeRepository inviteCodeRepository,
                                DoctorRepository doctorRepository,
                                HealthRecordRepository healthRecordRepository,
                                PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.familyRepository = familyRepository;
        this.memberRepository = memberRepository;
        this.inviteCodeRepository = inviteCodeRepository;
        this.doctorRepository = doctorRepository;
        this.healthRecordRepository = healthRecordRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public RegisterResponse registerUser(RegisterRequest request) {
        // Validate email uniqueness
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        if ("HEAD".equalsIgnoreCase(request.getUserType())) {
            return registerHouseholdHead(request);
        } else if ("MEMBER".equalsIgnoreCase(request.getUserType())) {
            return registerFamilyMember(request);
        } else if ("DOCTOR".equalsIgnoreCase(request.getUserType())) {
            return registerDoctor(request);
        } else {
            throw new IllegalArgumentException("Invalid user type. Must be 'HEAD', 'MEMBER', or 'DOCTOR'");
        }
    }

    private RegisterResponse registerHouseholdHead(RegisterRequest request) {
        // 1. Create User account
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole("user"); // Default role
        user.setLocked(false);
        User savedUser = userRepository.save(user);

        // 2. Create Family with address
        Family family = new Family();
        family.setDoctor(null); // No doctor assigned yet
        family.setAddress(request.getAddress()); // Set family address
        Family savedFamily = familyRepository.save(family);

        // 3. Create Member with role_in_family = HEAD
        Member member = new Member();
        member.setUser(savedUser);
        member.setFamily(savedFamily);
        member.setRoleInFamily("HEAD");
        member.setPhone(request.getPhone());
        member.setEmail(request.getEmail());
        
        // Set date of birth if provided
        if (request.getDateOfBirth() != null && !request.getDateOfBirth().isEmpty()) {
            try {
                member.setDayOfBirth(java.time.LocalDate.parse(request.getDateOfBirth()));
            } catch (Exception e) {
                // Handle invalid date format
            }
        }
        
        Member savedMember = memberRepository.save(member);

        // 4. Create default health record for this member (only if not exists)
        if (healthRecordRepository.findByMemberMemberId(savedMember.getMemberId()).isEmpty()) {
            HealthRecord healthRecord = new HealthRecord();
            healthRecord.setMember(savedMember);
            healthRecord.setBloodType("Chưa xác định");
            healthRecord.setAllergies("");
            healthRecord.setChronicConditions("");
            healthRecordRepository.save(healthRecord);
        }

        // 5. Generate Invite Code for this family
        String code = generateUniqueInviteCode();
        InviteCode inviteCode = new InviteCode();
        inviteCode.setFamily(savedFamily);
        inviteCode.setCode(code);
        inviteCode.setCreatedAt(Instant.now());
        inviteCode.setExpiredAt(Instant.now().plus(30, ChronoUnit.DAYS)); // Valid for 30 days
        inviteCodeRepository.save(inviteCode);

        return new RegisterResponse(
                savedUser.getUserId(),
                savedUser.getEmail(),
                savedUser.getName(),
                savedFamily.getFamilyId(),
                "HEAD",
                "Household head registered successfully. Invite code: " + code
        );
    }

    private RegisterResponse registerFamilyMember(RegisterRequest request) {
        // Validate invite code is provided
        if (request.getInviteCode() == null || request.getInviteCode().trim().isEmpty()) {
            throw new IllegalArgumentException("Invite code is required for family member registration");
        }

        // 1. Validate invite code and get family
        InviteCode inviteCode = inviteCodeRepository.findByCode(request.getInviteCode())
                .orElseThrow(() -> new IllegalArgumentException("Invalid invite code"));

        // Check if invite code is expired
        if (inviteCode.getExpiredAt() != null && inviteCode.getExpiredAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Invite code has expired");
        }

        Family family = inviteCode.getFamily();
        if (family == null) {
            throw new IllegalArgumentException("Invite code is not associated with any family");
        }

        // 2. Create User account
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole("user"); // Default role
        user.setLocked(false);
        User savedUser = userRepository.save(user);

        // 3. Create Member with role_in_family = MEMBER and link to family
        Member member = new Member();
        member.setUser(savedUser);
        member.setFamily(family);
        member.setRoleInFamily("MEMBER");
        member.setPhone(request.getPhone());
        member.setEmail(request.getEmail());
        
        // Set date of birth if provided
        if (request.getDateOfBirth() != null && !request.getDateOfBirth().isEmpty()) {
            try {
                member.setDayOfBirth(java.time.LocalDate.parse(request.getDateOfBirth()));
            } catch (Exception e) {
                // Handle invalid date format
            }
        }
        
        Member savedMember = memberRepository.save(member);

        // 4. Create default health record for this member (only if not exists)
        if (healthRecordRepository.findByMemberMemberId(savedMember.getMemberId()).isEmpty()) {
            HealthRecord healthRecord = new HealthRecord();
            healthRecord.setMember(savedMember);
            healthRecord.setBloodType("Chưa xác định");
            healthRecord.setAllergies("");
            healthRecord.setChronicConditions("");
            healthRecordRepository.save(healthRecord);
        }

        return new RegisterResponse(
                savedUser.getUserId(),
                savedUser.getEmail(),
                savedUser.getName(),
                family.getFamilyId(),
                "MEMBER",
                "Family member registered successfully"
        );
    }

    private RegisterResponse registerDoctor(RegisterRequest request) {
        // Validate certificate number is provided
        if (request.getCertificateNumber() == null || request.getCertificateNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Certificate number is required for doctor registration");
        }

        // 1. Create User account with DOCTOR role
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole("DOCTOR"); // Set role to DOCTOR (all caps)
        user.setLocked(false);
        User savedUser = userRepository.save(user);

        // 2. Create Doctor record
        Doctor doctor = new Doctor();
        doctor.setUser(savedUser);
        doctor.setCertificateNumber(request.getCertificateNumber());
        doctor.setPhone(request.getPhone());
        doctor.setAddress(request.getAddress());
        doctor.setSpecialization(request.getSpecialization());
        doctor.setClinicName(request.getClinicName());
        doctor.setEducation(request.getEducation());
        doctorRepository.save(doctor);

        return new RegisterResponse(
                savedUser.getUserId(),
                savedUser.getEmail(),
                savedUser.getName(),
                null, // No family for doctor
                "DOCTOR",
                "Doctor registered successfully. Certificate: " + request.getCertificateNumber()
        );
    }

    private String generateUniqueInviteCode() {
        String code;
        do {
            code = "FAM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (inviteCodeRepository.findByCode(code).isPresent());
        return code;
    }
}
