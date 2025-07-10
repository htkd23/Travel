package com.travel5.be.service;

import com.travel5.be.entity.Booking;
import com.travel5.be.entity.BookingStatus;
import com.travel5.be.entity.Notification;
import com.travel5.be.repository.NotificationRepository;
import com.travel5.be.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailNotificationService emailNotificationService;

    public void sendNotification(Integer senderId, Integer receiverId, String message, Booking booking, BookingStatus status) {
        Notification notification = new Notification();
        notification.setSenderId(senderId);
        notification.setReceiverId(receiverId);
        notification.setMessage(message);
        notification.setBooking(booking);
        notificationRepository.save(notification);

        // Nếu người gửi là admin và người nhận là user => gửi email
        if (senderId != null && !senderId.equals(receiverId)) {
            String email = booking.getEmail();
            if (email != null && !email.isBlank()) {
                String subject;
                String content;

                if (status == BookingStatus.CONFIRMED) {
                    subject = "Xác nhận đặt tour thành công";
                    content = "Chúc mừng! Tour của bạn đã được xác nhận.";
                } else if (status == BookingStatus.CANCELLED) {
                    subject = "Đơn đặt tour đã bị hủy";
                    content = "Rất tiếc! Đơn đặt tour của bạn đã bị hủy bởi quản trị viên.";

                    // 🔁 THÊM: nếu message có từ khóa "hoàn lại điểm" thì thêm nội dung bổ sung
                    if (message != null && message.toLowerCase().contains("hoàn lại 50 điểm")) {
                        content += " Hệ thống đã hoàn lại 50 điểm tích luỹ cho bạn.";
                    }
                } else {
                    return; // Không gửi nếu không phải CONFIRMED/CANCELLED
                }

                emailNotificationService.sendEmail(email, subject, content);
            }
        }
    }




    public void markNotificationsHandled(Integer senderId, Integer receiverId, Integer bookingId) {
        List<Notification> notifications = notificationRepository
                .findBySenderIdAndReceiverIdAndBooking_BookingId(senderId, receiverId, bookingId);

        for (Notification notification : notifications) {
            notification.setStatus(true);
        }

        notificationRepository.saveAll(notifications);
    }
}
