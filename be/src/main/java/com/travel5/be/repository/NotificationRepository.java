package com.travel5.be.repository;

import com.travel5.be.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findBySenderIdAndReceiverIdAndBooking_BookingId(Integer senderId, Integer receiverId, Integer bookingId);
    List<Notification> findByReceiverIdAndStatusFalseOrderByCreatedAtDesc(Integer receiverId);
}

