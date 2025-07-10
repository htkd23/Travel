package com.travel5.be.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import com.travel5.be.config.VietnameseNormalizer;
import com.travel5.be.entity.*;
import com.travel5.be.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

import com.travel5.be.dto.request.BookingRequest;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private VoucherUsageRepository voucherUsageRepository;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private VoucherService voucherService;

    @Autowired
    private ScheduledEmailService scheduledEmailService;

    public Booking createBooking(BookingRequest request) {
        User user = userRepository.findById(request.getUserId()).orElseThrow();
        Tour tour = tourRepository.findById(request.getTourId()).orElseThrow();

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setTour(tour);
        booking.setFullName(request.getFullName());
        booking.setEmail(request.getEmail());
        booking.setPhone(request.getPhone());
        booking.setNote(request.getNote());
        booking.setStatus(BookingStatus.PENDING);
        booking.setPaymentStatus(PaymentStatus.UNPAID);

        BigDecimal discountedPrice = calculateDiscountedPrice(tour);

        if (Boolean.TRUE.equals(request.getUseLoyaltyPoints())) {
            if (user.getLoyaltyPointsSafe() >= 50) {
                discountedPrice = discountedPrice.subtract(BigDecimal.valueOf(50));
                user.setLoyaltyPoints(user.getLoyaltyPointsSafe() - 50);
                userRepository.save(user);
            } else {
                throw new RuntimeException("Bạn không đủ điểm để sử dụng.");
            }
        }

        if (discountedPrice.compareTo(BigDecimal.ZERO) < 0) {
            discountedPrice = BigDecimal.ZERO;
        }

        booking.setDiscountedPrice(discountedPrice);

        Booking savedBooking = bookingRepository.save(booking);

        paymentService.generateQrAndUpdateBooking(savedBooking);

        List<User> admins = userRepository.findUsersByRole("ADMIN");
        Integer senderId = savedBooking.getUser().getId();
        BookingStatus status = savedBooking.getStatus();
        for (User admin : admins) {
            notificationService.sendNotification(senderId, admin.getId(),
                    "Bạn có đơn đặt tour mới: " + savedBooking.getFullName(),
                    savedBooking, status);
        }

        return savedBooking;
    }

    private BigDecimal calculateCurrentPrice(Booking booking) {
        if (booking.getDiscountedPrice() != null) {
            return booking.getDiscountedPrice();
        }
        return calculateDiscountedPrice(booking.getTour());
    }

    private boolean isVoucherValid(Voucher voucher) {
        LocalDate today = LocalDate.now();
        return !today.isBefore(voucher.getValidFrom()) && !today.isAfter(voucher.getValidTo());
    }

    private void markVoucherAsUsed(Voucher voucher) {
        voucher.setStatus(VoucherStatus.USED);
        voucherRepository.save(voucher);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(Integer bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with id " + bookingId));
    }

    public List<Booking> getBookingsByUserId(Integer userId) {
        return bookingRepository.findByUserId(userId);
    }

    public void deleteBooking(Integer bookingId) {
        bookingRepository.deleteById(bookingId);
    }

    public Booking updateBookingStatus(Integer bookingId, BookingStatus status) {
        Booking booking = getBookingById(bookingId);

        if (status == BookingStatus.CONFIRMED && booking.getPaymentStatus() == PaymentStatus.PAID) {
            User user = booking.getUser();
            if (user != null) {
                int loyaltyPoints = user.getLoyaltyPoints();
                user.setLoyaltyPoints(loyaltyPoints + 10);
                userRepository.save(user);
            }

            if (booking.getTour() != null && booking.getDiscountedPrice() != null) {
                BigDecimal originalPrice = booking.getTour().getPrice();
                booking.setDiscountedPrice(originalPrice);
            }
            booking.setPaymentStatus(PaymentStatus.PAID);
        }

        booking.setStatus(status);
        Booking saved = bookingRepository.save(booking);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        Integer senderId = currentUser.getId();
        Integer receiverId = booking.getUser().getId();
        String message = "Đơn hàng đã được xác nhận và điểm tích lũy đã được cộng!";
        notificationService.sendNotification(senderId, receiverId, message, saved, status);

        return saved;
    }


    public Booking updateBooking(Integer bookingId, BookingRequest request) {
        Booking booking = getBookingById(bookingId);

        if (request.getFullName() != null) booking.setFullName(request.getFullName());
        if (request.getEmail() != null) booking.setEmail(request.getEmail());
        if (request.getPhone() != null) booking.setPhone(request.getPhone());
        if (request.getNote() != null) booking.setNote(request.getNote());

        if (request.getUserId() != null)
            booking.setUser(userRepository.findById(request.getUserId()).orElseThrow());

        if (request.getTourId() != null)
            booking.setTour(tourRepository.findById(request.getTourId()).orElseThrow());

        if (Boolean.TRUE.equals(request.getUseLoyaltyPoints())) {
            User user = booking.getUser();
            if (user != null && user.getLoyaltyPoints() != null && user.getLoyaltyPoints() >= 50) {
                BigDecimal currentPrice = calculateCurrentPrice(booking);

                BigDecimal newPrice = currentPrice.subtract(BigDecimal.valueOf(50));
                if (newPrice.compareTo(BigDecimal.ZERO) < 0) {
                    newPrice = BigDecimal.ZERO;
                }

                booking.setDiscountedPrice(newPrice);
                user.setLoyaltyPoints(user.getLoyaltyPoints() - 50);
                userRepository.save(user);

                paymentService.generateQrAndUpdateBooking(booking);
            } else {
                throw new RuntimeException("Bạn không đủ điểm để sử dụng.");
            }
        }

        return bookingRepository.save(booking);
    }

    public List<Booking> searchBookings(String keyword, String tourType, String status, String paymentStatus) {
        String normalizedKeyword = VietnameseNormalizer.normalize(keyword);
        final TourType tourTypeFinal = (tourType != null && !tourType.isEmpty()) ? TourType.fromString(tourType) : null;
        final BookingStatus statusFinal = (status != null && !status.isEmpty()) ? BookingStatus.valueOf(status.toUpperCase()) : null;
        final PaymentStatus paymentStatusFinal = (paymentStatus != null && !paymentStatus.isEmpty())
                ? PaymentStatus.valueOf(paymentStatus.toUpperCase())
                : null;

        return bookingRepository.findAll().stream()
                .filter(b -> {
                    boolean matchesKeyword = normalizedKeyword.isEmpty() ||
                            VietnameseNormalizer.normalize(b.getFullName()).contains(normalizedKeyword) ||
                            VietnameseNormalizer.normalize(b.getPhone()).contains(normalizedKeyword) ||
                            VietnameseNormalizer.normalize(b.getNote()).contains(normalizedKeyword) ||
                            VietnameseNormalizer.normalize(b.getTour().getTourName()).contains(normalizedKeyword);

                    boolean matchesTourType = (tourTypeFinal == null || b.getTour().getTourType() == tourTypeFinal);
                    boolean matchesStatus = (statusFinal == null || b.getStatus() == statusFinal);
                    boolean matchesPaymentStatus = (paymentStatusFinal == null || b.getPaymentStatus() == paymentStatusFinal);

                    return matchesKeyword && matchesTourType && matchesStatus && matchesPaymentStatus;
                })
                .collect(Collectors.toList());
    }

    private BigDecimal calculateDiscountedPrice(Tour tour) {
        if (tour.getVoucher() != null
                && tour.getVoucher().getStatus() == VoucherStatus.ACTIVE
                && LocalDate.now().isAfter(tour.getVoucher().getValidFrom())
                && LocalDate.now().isBefore(tour.getVoucher().getValidTo())) {
            BigDecimal discountRate = BigDecimal.ONE.subtract(
                    tour.getVoucher().getDiscountPercentage().divide(BigDecimal.valueOf(100))
            );
            return tour.getPrice().multiply(discountRate);
        }
        return tour.getPrice();
    }

    public void sendReminderEmailNow(Integer bookingId) {
        scheduledEmailService.sendEmailImmediately(bookingId);
    }
}
