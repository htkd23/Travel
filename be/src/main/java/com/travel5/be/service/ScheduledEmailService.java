package com.travel5.be.service;

import com.travel5.be.dto.ScheduledEmailDTO;
import com.travel5.be.entity.Booking;
import com.travel5.be.entity.BookingStatus;
import com.travel5.be.entity.PaymentStatus;
import com.travel5.be.entity.ScheduledEmail;
import com.travel5.be.repository.BookingRepository;
import com.travel5.be.repository.ScheduledEmailRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ScheduledEmailService {

    @Autowired
    private ScheduledEmailRepository scheduledEmailRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private BookingRepository bookingRepository;

    /**
     * Chạy mỗi 5 phút kiểm tra xem có email nào cần gửi
     */
    @Scheduled(fixedDelay = 5 * 60 * 1000)
    @Transactional
    public void sendScheduledEmails() {
        // Lấy tất cả booking CONFIRMED + PAID, chưa đi
        List<Booking> bookings = bookingRepository.findAll().stream()
                .filter(b ->
                        b.getStatus() == BookingStatus.CONFIRMED &&
                                b.getPaymentStatus() == PaymentStatus.PAID &&
                                b.getTour() != null &&
                                b.getTour().getStartDate() != null &&
                                b.getTour().getStartDate().isAfter(LocalDate.now())
                )
                .collect(Collectors.toList());

        for (Booking booking : bookings) {
            Optional<ScheduledEmail> optionalScheduledEmail =
                    scheduledEmailRepository.findByBooking_BookingId(booking.getBookingId());

            if (optionalScheduledEmail.isEmpty()) {
                // Chưa từng có ScheduledEmail → tạo mới
                LocalDateTime tourStart = booking.getTour().getStartDate().atStartOfDay();
                LocalDateTime remindTime = tourStart.minusDays(1).withHour(20).withMinute(0);

                ScheduledEmail scheduledEmail = new ScheduledEmail();
                scheduledEmail.setBooking(booking);
                scheduledEmail.setScheduledTime(remindTime);
                scheduledEmail.setSent(false);
                scheduledEmailRepository.save(scheduledEmail);

                System.out.printf("✅ Đã tự tạo ScheduledEmail cho bookingId %d, nhắc lúc %s%n",
                        booking.getBookingId(), remindTime);
            }
        }

        // Gửi những ScheduledEmail đến hạn
        List<ScheduledEmail> dueEmails =
                scheduledEmailRepository.findByIsSentFalseAndScheduledTimeBefore(LocalDateTime.now());

        for (ScheduledEmail scheduledEmail : dueEmails) {
            sendEmail(scheduledEmail);
            scheduledEmail.setSent(true);
            scheduledEmailRepository.save(scheduledEmail);

            System.out.printf("✅ Đã tự động gửi email nhắc lịch cho bookingId %d%n",
                    scheduledEmail.getBooking().getBookingId());
        }
    }


    /**
     * Hàm gửi email thủ công khi click button "Gửi ngay"
     */
    public void sendEmailImmediately(Integer bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Optional<ScheduledEmail> opt = scheduledEmailRepository.findByBooking_BookingId(bookingId);

        ScheduledEmail scheduledEmail;
        if (opt.isPresent()) {
            scheduledEmail = opt.get();

            if (scheduledEmail.isSent()) {
                throw new RuntimeException("Email nhắc lịch đã được gửi trước đó!");
            }

        } else {
            scheduledEmail = new ScheduledEmail();
            scheduledEmail.setBooking(booking);
        }

        scheduledEmail.setScheduledTime(LocalDateTime.now());
        scheduledEmail.setSent(true);
        scheduledEmailRepository.save(scheduledEmail);

        sendEmail(scheduledEmail);
    }


    private void sendEmail(ScheduledEmail scheduledEmail) {
        Booking booking = scheduledEmail.getBooking();

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(booking.getEmail());
        message.setSubject("Nhắc lịch đi tour của bạn!");
        message.setText(String.format("""
            Xin chào %s,

            Chúng tôi xin nhắc bạn rằng tour %s sẽ bắt đầu vào %s tại %s.

            Chúc bạn có một chuyến đi vui vẻ!
            """,
                booking.getFullName(),
                booking.getTour().getTourName(),
                booking.getTour().getStartDate(),
                booking.getTour().getLocation()
        ));

        mailSender.send(message);
    }

    public void scheduleEmailReminder(Booking booking) {
        if (booking.getTour().getStartDate() != null) {
            LocalDateTime tourStart = booking.getTour().getStartDate().atStartOfDay();

            LocalDateTime remindTime = tourStart.minusDays(1).withHour(19).withMinute(0);

            ScheduledEmail scheduledEmail = new ScheduledEmail();
            scheduledEmail.setBooking(booking);
            scheduledEmail.setScheduledTime(remindTime);

            scheduledEmailRepository.save(scheduledEmail);
        }
    }

    public List<ScheduledEmailDTO> getPendingReminders() {
        List<ScheduledEmail> list = scheduledEmailRepository.findByIsSentFalse();

        return list.stream().map(se -> {
            Booking booking = se.getBooking();
            return new ScheduledEmailDTO(
                    booking.getBookingId(),
                    booking.getTour().getTourName(),
                    booking.getFullName(),
                    booking.getDiscountedPrice(),
                    booking.getTour().getStartDate(),
                    se.isSent()
            );
        }).collect(Collectors.toList());
    }

    public List<ScheduledEmailDTO> getAllReminders() {
        List<Booking> confirmedBookings = bookingRepository.findAll().stream()
                .filter(b ->
                        b.getStatus() == BookingStatus.CONFIRMED &&
                                b.getPaymentStatus() == PaymentStatus.PAID
                )
                .collect(Collectors.toList());

        return confirmedBookings.stream().map(booking -> {
            boolean isSent = scheduledEmailRepository
                    .findByBooking_BookingId(booking.getBookingId())
                    .map(ScheduledEmail::isSent)
                    .orElse(false);

            return new ScheduledEmailDTO(
                    booking.getBookingId(),
                    booking.getTour().getTourName(),
                    booking.getFullName(),
                    booking.getDiscountedPrice(),
                    booking.getTour().getStartDate(),
                    isSent
            );
        }).collect(Collectors.toList());
    }

}
