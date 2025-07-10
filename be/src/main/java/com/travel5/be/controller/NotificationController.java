package com.travel5.be.controller;

import com.travel5.be.entity.Notification;
import com.travel5.be.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/notifications")
@CrossOrigin("*")
public class NotificationController {
    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<Notification>> getNotificationsForUser(@PathVariable Integer userId) {
        List<Notification> notifications = notificationRepository.findByReceiverIdAndStatusFalseOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(notifications);
    }
    @PutMapping("/mark-read/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<?> markNotificationsAsRead(@PathVariable Integer userId) {
        List<Notification> notifications = notificationRepository.findByReceiverIdAndStatusFalseOrderByCreatedAtDesc(userId);
        for (Notification n : notifications) {
            n.setStatus(true);
        }
        notificationRepository.saveAll(notifications);
        return ResponseEntity.ok("Đã đánh dấu tất cả thông báo là đã đọc.");
    }

}

