package com.example.backend.controller;

import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.dto.user.UserCreateRequest;
import com.example.backend.dto.user.UserUpdateRequest;
import com.example.backend.entity.User;
import com.example.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
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
    // @PreAuthorize("hasRole('ADMIN')")
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
        User payload = new User();
        payload.setRole(req.getRole());
        payload.setPasswordHash(req.getPasswordHash());
        payload.setName(req.getName());
        payload.setPhone(req.getPhone());
        payload.setEmail(req.getEmail());
        return ApiResponse.<UserResponse>builder()
                .result(toResponse(userService.update(id, payload)))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        userService.delete(id);
        return ApiResponse.<Void>builder().build();
    }

    private UserResponse toResponse(User u) {
        UserResponse res = new UserResponse();
        res.setUserId(u.getUserId());
        res.setRole(u.getRole());
        res.setName(u.getName());
        res.setPhone(u.getPhone());
        res.setEmail(u.getEmail());
        return res;
    }
}


