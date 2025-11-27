package com.example.backend.repository;

import com.example.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    
    /**
     * Tìm tất cả notifications của một user
     */
    List<Notification> findByUser_UserIdOrderByCreatedAtDesc(Integer userId);
    
    /**
     * Tìm notifications chưa đọc của user
     */
    @Query("SELECT n FROM Notification n WHERE n.user.userId = :userId " +
           "AND n.isRead = false ORDER BY n.createdAt DESC")
    List<Notification> findUnreadByUser(@Param("userId") Integer userId);
    
    /**
     * Đếm số notifications chưa đọc
     */
    long countByUser_UserIdAndIsReadFalse(Integer userId);
    
    /**
     * Tìm notifications theo type
     */
    List<Notification> findByUser_UserIdAndType(Integer userId, String type);
}
