package com.example.backend.controller;

import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.dto.user.UserCreateRequest;
import com.example.backend.dto.user.UserUpdateRequest;
import com.example.backend.entity.Member;
import com.example.backend.entity.User;
import com.example.backend.repository.MemberRepository;
import com.example.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {
    private final UserService userService;
    private final MemberRepository memberRepository;

    public UserController(UserService userService, MemberRepository memberRepository) {
        this.userService = userService;
        this.memberRepository = memberRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ApiResponse<Page<UserResponse>> getAll(Pageable pageable) {
        return ApiResponse.<Page<UserResponse>>builder()
                .result(userService.findAll(pageable).map(this::toResponse))
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ApiResponse<UserResponse> getById(@PathVariable Integer id) {
        return ApiResponse.<UserResponse>builder()
                .result(toResponse(userService.findById(id)))
                .build();
    }

    @PostMapping
//    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<UserResponse> create(@Valid @RequestBody UserCreateRequest req) {
        User toSave = new User();
        toSave.setRole(req.getRole());
        toSave.setPasswordHash(req.getPasswordHash());
        toSave.setName(req.getName());
        toSave.setPhone(req.getPhone());
        toSave.setEmail(req.getEmail());
        User created = userService.create(toSave);
        return ApiResponse.<UserResponse>builder()
                .result(toResponse(created))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<UserResponse> update(@PathVariable Integer id, @Valid @RequestBody UserUpdateRequest req) {
//        User payload = new User();
//        payload.setRole(req.getRole());
//        payload.setPasswordHash(req.getPasswordHash());
//        payload.setName(req.getName());
//        payload.setPhone(req.getPhone());
//        payload.setEmail(req.getEmail());
        return ApiResponse.<UserResponse>builder()
                .result(toResponse(userService.update(id, req)))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        userService.delete(id);
        return ApiResponse.<Void>builder().build();
    }

    @GetMapping("/me/family")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ApiResponse<Map<String, Object>> getMyFamily(@AuthenticationPrincipal Jwt jwt) {
        // Get userId from JWT claim instead of subject (subject contains email)
        // JWT claims return Long by default, need to convert to Integer
        Object userIdClaim = jwt.getClaim("userId");
        if (userIdClaim == null) {
            throw new RuntimeException("UserId not found in token");
        }
        Integer userId = ((Number) userIdClaim).intValue();
        
        // Find member by userId - return null if not found
        Member member = memberRepository.findByUserId(userId).orElse(null);
        
        Map<String, Object> result = new HashMap<>();
        if (member == null || member.getFamily() == null) {
            // User is not a member of any family yet
            result.put("familyId", null);
            result.put("memberId", null);
            result.put("roleInFamily", null);
            result.put("message", "User is not a member of any family. Please create or join a family first.");
        } else {
            result.put("familyId", member.getFamily().getFamilyId());
            result.put("memberId", member.getMemberId());
            result.put("roleInFamily", member.getRoleInFamily());
        }
        
        return ApiResponse.<Map<String, Object>>builder()
                .result(result)
                .build();
    }

    private UserResponse toResponse(User u) {
        UserResponse res = new UserResponse();
        res.setUserId(u.getUserId());
        res.setRole(u.getRole());
        res.setName(u.getName());
        res.setPhone(u.getPhone());
        res.setEmail(u.getEmail());
        res.setLocked(u.getLocked());
        res.setCreatedAt(u.getCreatedAt());
        return res;
    }
}


