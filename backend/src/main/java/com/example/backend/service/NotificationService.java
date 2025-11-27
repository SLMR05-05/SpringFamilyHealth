package com.example.backend.service;

import com.example.backend.entity.Notification;
import com.example.backend.entity.User;
import com.example.backend.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository repo;
    private final UserService userService;

    public NotificationService(NotificationRepository repo, UserService userService) {
        this.repo = repo;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public List<Notification> findAll() {
        return repo.findAll();
    }

    @Transactional(readOnly = true)
    public Notification findById(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Notification not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<Notification> findByUserId(Integer userId) {
        return repo.findByUser_UserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public List<Notification> findUnreadByUserId(Integer userId) {
        return repo.findUnreadByUser(userId);
    }

    @Transactional(readOnly = true)
    public long countUnreadByUserId(Integer userId) {
        return repo.countByUser_UserIdAndIsReadFalse(userId);
    }

    @Transactional
    public Notification create(Integer userId, String title, String message, String type) {
        User user = userService.findById(userId);
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type != null ? type : "INFO");
        notification.setIsRead(false);
        return repo.save(notification);
    }

    @Transactional
    public Notification markAsRead(Integer notificationId) {
        Notification notification = findById(notificationId);
        notification.setIsRead(true);
        return repo.save(notification);
    }

    @Transactional
    public void markAllAsReadForUser(Integer userId) {
        List<Notification> unreadNotifications = repo.findUnreadByUser(userId);
        for (Notification notification : unreadNotifications) {
            notification.setIsRead(true);
        }
        repo.saveAll(unreadNotifications);
    }

    @Transactional
    public void delete(Integer id) {
        repo.delete(findById(id));
    }
}
