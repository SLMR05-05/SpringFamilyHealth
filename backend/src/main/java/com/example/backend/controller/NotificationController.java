package com.example.backend.controller;

import com.example.backend.dto.notification.NotificationCreateRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.NotificationResponse;
import com.example.backend.entity.Notification;
import com.example.backend.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin
public class NotificationController {
    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    /**
     * Get all notifications for a specific user (by userId parameter)
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN','USER','DOCTOR')")
    public ApiResponse<List<NotificationResponse>> getByUserId(@PathVariable Integer userId) {
        List<Notification> notifications = service.findByUserId(userId);
        return ApiResponse.<List<NotificationResponse>>builder()
                .result(notifications.stream().map(this::toResponse).collect(Collectors.toList()))
                .build();
    }

    /**
     * Get unread notifications for current authenticated user
     */
    @GetMapping("/unread")
    @PreAuthorize("hasAnyRole('ADMIN','USER','DOCTOR')")
    public ApiResponse<List<NotificationResponse>> getUnread(Authentication authentication) {
        Integer userId = extractUserId(authentication);
        List<Notification> notifications = service.findUnreadByUserId(userId);
        return ApiResponse.<List<NotificationResponse>>builder()
                .result(notifications.stream().map(this::toResponse).collect(Collectors.toList()))
                .build();
    }

    /**
     * Get unread count for current authenticated user
     */
    @GetMapping("/unread/count")
    @PreAuthorize("hasAnyRole('ADMIN','USER','DOCTOR')")
    public ApiResponse<Long> getUnreadCount(Authentication authentication) {
        Integer userId = extractUserId(authentication);
        long count = service.countUnreadByUserId(userId);
        return ApiResponse.<Long>builder()
                .result(count)
                .build();
    }

    /**
     * Mark a specific notification as read
     */
    @PutMapping("/{id}/read")
    @PreAuthorize("hasAnyRole('ADMIN','USER','DOCTOR')")
    public ApiResponse<NotificationResponse> markAsRead(@PathVariable Integer id) {
        Notification notification = service.markAsRead(id);
        return ApiResponse.<NotificationResponse>builder()
                .result(toResponse(notification))
                .build();
    }

    /**
     * Mark all notifications as read for current user
     */
    @PutMapping("/read-all")
    @PreAuthorize("hasAnyRole('ADMIN','USER','DOCTOR')")
    public ApiResponse<Void> markAllAsRead(Authentication authentication) {
        Integer userId = extractUserId(authentication);
        service.markAllAsReadForUser(userId);
        return ApiResponse.<Void>builder()
                .message("All notifications marked as read")
                .build();
    }

    /**
     * Create a new notification (Admin only)
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<NotificationResponse> create(@Valid @RequestBody NotificationCreateRequest req) {
        Notification notification = service.create(
                req.getUserId(),
                req.getTitle(),
                req.getMessage(),
                req.getType()
        );
        return ApiResponse.<NotificationResponse>builder()
                .result(toResponse(notification))
                .build();
    }

    /**
     * Delete a notification
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER','DOCTOR')")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ApiResponse.<Void>builder()
                .message("Notification deleted successfully")
                .build();
    }

    // Helper methods
    private NotificationResponse toResponse(Notification notification) {
        return NotificationResponse.builder()
                .notificationId(notification.getNotificationId())
                .userId(notification.getUser().getUserId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }

    private Integer extractUserId(Authentication authentication) {
        // Extract userId from JWT token (assuming CustomJWT with userId claim)
        Object principal = authentication.getPrincipal();
        if (principal instanceof org.springframework.security.oauth2.jwt.Jwt) {
            org.springframework.security.oauth2.jwt.Jwt jwt = (org.springframework.security.oauth2.jwt.Jwt) principal;
            Object userIdClaim = jwt.getClaim("userId");
            
            // Handle both Long and Integer types
            if (userIdClaim instanceof Long) {
                return ((Long) userIdClaim).intValue();
            } else if (userIdClaim instanceof Integer) {
                return (Integer) userIdClaim;
            } else if (userIdClaim instanceof Number) {
                return ((Number) userIdClaim).intValue();
            }
            
            throw new RuntimeException("Invalid userId claim type: " + 
                (userIdClaim != null ? userIdClaim.getClass().getName() : "null"));
        }
        throw new RuntimeException("Unable to extract userId from authentication");
    }
}
