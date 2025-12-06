package com.example.backend.service;

import com.example.backend.dto.doctorrequest.DoctorRequestCreateDTO;
import com.example.backend.dto.doctorrequest.DoctorRequestDTO;
import com.example.backend.dto.doctorrequest.DoctorRequestResponseDTO;
import com.example.backend.entity.Doctor;
import com.example.backend.entity.DoctorRequest;
import com.example.backend.entity.Family;
import com.example.backend.entity.User;
import com.example.backend.repository.DoctorRepository;
import com.example.backend.repository.DoctorRequestRepository;
import com.example.backend.repository.FamilyRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class DoctorRequestService {
    private final DoctorRequestRepository requestRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final FamilyRepository familyRepository;

    public DoctorRequestService(DoctorRequestRepository requestRepository,
                                DoctorRepository doctorRepository,
                                UserRepository userRepository,
                                FamilyRepository familyRepository) {
        this.requestRepository = requestRepository;
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.familyRepository = familyRepository;
    }

    @Transactional
    public DoctorRequestDTO createRequest(Integer userId, DoctorRequestCreateDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));

        Family family = null;
        if (dto.getFamilyId() != null) {
            family = familyRepository.findById(dto.getFamilyId())
                    .orElseThrow(() -> new IllegalArgumentException("Family not found"));
        }

        DoctorRequest request = new DoctorRequest();
        request.setUser(user);
        request.setDoctor(doctor);
        request.setFamily(family);
        request.setMessage(dto.getMessage());

        // Parse request type
        try {
            request.setRequestType(DoctorRequest.RequestType.valueOf(dto.getRequestType().toUpperCase()));
        } catch (Exception e) {
            request.setRequestType(DoctorRequest.RequestType.FAMILY_DOCTOR);
        }

        request.setStatus(DoctorRequest.RequestStatus.PENDING);

        DoctorRequest saved = requestRepository.save(request);
        return toDTO(saved);
    }

    public Page<DoctorRequestDTO> getRequestsForDoctor(Integer doctorId, String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<DoctorRequest> requests;
        if (status != null && !status.isEmpty()) {
            try {
                DoctorRequest.RequestStatus requestStatus = DoctorRequest.RequestStatus.valueOf(status.toUpperCase());
                requests = requestRepository.findByDoctor_DoctorIdAndStatus(doctorId, requestStatus, pageable);
            } catch (Exception e) {
                requests = requestRepository.findByDoctor_DoctorId(doctorId, pageable);
            }
        } else {
            requests = requestRepository.findByDoctor_DoctorId(doctorId, pageable);
        }

        return requests.map(this::toDTO);
    }

    public long countPendingRequests(Integer doctorId) {
        return requestRepository.countByDoctor_DoctorIdAndStatus(doctorId, DoctorRequest.RequestStatus.PENDING);
    }

    @Transactional
    public DoctorRequestDTO respondToRequest(Integer requestId, Integer doctorId, DoctorRequestResponseDTO responseDTO) {
        DoctorRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        // Verify doctor owns this request
        if (!request.getDoctor().getDoctorId().equals(doctorId)) {
            throw new IllegalArgumentException("You are not authorized to respond to this request");
        }

        request.setDoctorResponse(responseDTO.getResponse());
        
        // Parse status
        DoctorRequest.RequestStatus newStatus;
        try {
            newStatus = DoctorRequest.RequestStatus.valueOf(responseDTO.getStatus().toUpperCase());
        } catch (Exception e) {
            newStatus = DoctorRequest.RequestStatus.APPROVED;
        }
        request.setStatus(newStatus);
        request.setRespondedAt(Instant.now());

        // If APPROVED and request type is FAMILY_DOCTOR, assign doctor to family
        if (newStatus == DoctorRequest.RequestStatus.APPROVED 
            && request.getRequestType() == DoctorRequest.RequestType.FAMILY_DOCTOR
            && request.getFamily() != null) {
            
            Family family = request.getFamily();
            family.setDoctor(request.getDoctor());
            familyRepository.save(family);
        }

        DoctorRequest saved = requestRepository.save(request);
        return toDTO(saved);
    }

    private DoctorRequestDTO toDTO(DoctorRequest request) {
        DoctorRequestDTO dto = new DoctorRequestDTO();
        dto.setRequestId(request.getRequestId());
        dto.setUserId(request.getUser().getUserId());
        dto.setUserName(request.getUser().getName());
        dto.setUserEmail(request.getUser().getEmail());
        dto.setDoctorId(request.getDoctor().getDoctorId());
        dto.setDoctorName(request.getDoctor().getUser().getName());
        dto.setFamilyId(request.getFamily() != null ? request.getFamily().getFamilyId() : null);
        dto.setRequestType(request.getRequestType().name());
        dto.setStatus(request.getStatus().name());
        dto.setMessage(request.getMessage());
        dto.setDoctorResponse(request.getDoctorResponse());
        dto.setCreatedAt(request.getCreatedAt());
        dto.setUpdatedAt(request.getUpdatedAt());
        dto.setRespondedAt(request.getRespondedAt());
        return dto;
    }
}
