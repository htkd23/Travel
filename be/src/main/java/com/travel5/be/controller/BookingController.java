package com.travel5.be.controller;

import java.util.List;

import com.travel5.be.dto.request.BookingStatusUpdateRequest;
import com.travel5.be.dto.response.BookingResponseDTO;
import com.travel5.be.entity.BookingStatus;
import com.travel5.be.service.ScheduledEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.travel5.be.dto.request.BookingRequest;
import com.travel5.be.entity.Booking;
import com.travel5.be.service.BookingService; // ✅ Đúng
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin("*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private ScheduledEmailService scheduledEmailService;

    // Phương thức POST để tạo mới booking
    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        Booking booking = bookingService.createBooking(request);

        BookingResponseDTO dto = new BookingResponseDTO(
                booking.getBookingId(),
                booking.getFullName(),
                booking.getEmail(),
                booking.getPhone(),
                booking.getNote(),
                booking.getDiscountedPrice(),
                booking.getBankQrCode(),
                booking.getPaymentStatus(),
                booking.getUser() != null ? booking.getUser().getLoyaltyPoints() : 0,
                booking.getDiscountedPrice() != null
                        ? booking.getDiscountedPrice()
                        : (booking.getTour() != null ? booking.getTour().getPrice() : null),
                booking.getTour() != null ? booking.getTour().getTourName() : null,
                booking.getTour() != null ? booking.getTour().getLocation() : null,
                booking.getTour() != null ? booking.getTour().getImagePath() : null,  // ✅ THÊM DÒNG NÀY
                booking.getUser() != null ? booking.getUser().getFirstName() + " " + booking.getUser().getLastName() : null,
                booking.getUser() != null ? booking.getUser().getEmail() : null,
                booking.isHasFeedback()
        );

        return ResponseEntity.ok(dto);
    }


    // Phương thức GET để lấy tất cả bookings
    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    // Phương thức GET để lấy booking theo bookingId
    @GetMapping("/{bookingId}")
    public ResponseEntity<?> getBookingById(@PathVariable Integer bookingId) {
        Booking booking = bookingService.getBookingById(bookingId);

        BookingResponseDTO dto = new BookingResponseDTO(
                booking.getBookingId(),
                booking.getFullName(),
                booking.getEmail(),
                booking.getPhone(),
                booking.getNote(),
                booking.getDiscountedPrice(),
                booking.getBankQrCode(),
                booking.getPaymentStatus(),
                booking.getUser() != null ? booking.getUser().getLoyaltyPoints() : 0,
                booking.getDiscountedPrice() != null ? booking.getDiscountedPrice() :
                        (booking.getTour() != null ? booking.getTour().getPrice() : null),
                booking.getTour() != null ? booking.getTour().getTourName() : null,
                booking.getTour() != null ? booking.getTour().getLocation() : null,
                booking.getTour() != null ? booking.getTour().getImagePath() : null,
                booking.getUser() != null ? booking.getUser().getFirstName() + " " + booking.getUser().getLastName() : null,
                booking.getUser() != null ? booking.getUser().getEmail() : null,
                booking.isHasFeedback()
        );


        return ResponseEntity.ok(dto);
    }



    // Phương thức GET để lấy bookings theo userId
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getBookingsByUserId(@PathVariable Integer userId) {
        List<Booking> bookings = bookingService.getBookingsByUserId(userId);
        return ResponseEntity.ok(bookings);
    }

    // Phương thức DELETE để xóa booking
    @DeleteMapping("/{bookingId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<String> deleteBooking(@PathVariable Integer bookingId) {
        try {
            bookingService.deleteBooking(bookingId);
            return ResponseEntity.ok("Booking deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error deleting booking: " + e.getMessage());
        }
    }
    // ADMIN xác nhận booking
    @PutMapping("/{bookingId}/confirm")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Booking> confirmBooking(@PathVariable Integer bookingId) {
        Booking updated = bookingService.updateBookingStatus(bookingId, BookingStatus.CONFIRMED);
        return ResponseEntity.ok(updated);
    }

    // USER hoặc ADMIN huỷ booking
    @PutMapping("/{bookingId}/cancel")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> cancelBooking(@PathVariable Integer bookingId) {
        try {
            Booking updated = bookingService.updateBookingStatus(bookingId, BookingStatus.CANCELLED);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Cập nhật trạng thái booking qua param
    @PutMapping("/update-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Booking> updateBookingStatus(@RequestBody BookingStatusUpdateRequest request) {
        Booking updated = bookingService.updateBookingStatus(request.getBookingId(), request.getStatus());
        return ResponseEntity.ok(updated);
    }
    @PutMapping("/{bookingId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateBooking(
            @PathVariable Integer bookingId,
            @RequestBody BookingRequest request
    ) {
        try {
            Booking updated = bookingService.updateBooking(bookingId, request);

            BookingResponseDTO dto = new BookingResponseDTO(
                    updated.getBookingId(),
                    updated.getFullName(),
                    updated.getEmail(),
                    updated.getPhone(),
                    updated.getNote(),
                    updated.getDiscountedPrice(),
                    updated.getBankQrCode(),
                    updated.getPaymentStatus(),
                    updated.getUser() != null ? updated.getUser().getLoyaltyPoints() : 0,
                    updated.getTour() != null ? updated.getTour().getPrice() : null,
                    updated.getTour() != null ? updated.getTour().getTourName() : null,
                    updated.getTour() != null ? updated.getTour().getLocation() : null,
                    updated.getTour() != null ? updated.getTour().getImagePath() : null,   // ✅ THÊM DÒNG NÀY
                    updated.getUser() != null ? updated.getUser().getFirstName() + " " + updated.getUser().getLastName() : null,
                    updated.getUser() != null ? updated.getUser().getEmail() : null,
                    updated.isHasFeedback()
            );


            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Cập nhật thất bại: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Booking>> searchBookings(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String tourType,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String paymentStatus // 👈 thêm dòng này
    ) {
        List<Booking> results = bookingService.searchBookings(keyword, tourType, status, paymentStatus);
        return ResponseEntity.ok(results);
    }
    @PutMapping("/{bookingId}/remind-email")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> sendReminderEmailNow(@PathVariable Integer bookingId) {
        scheduledEmailService.sendEmailImmediately(bookingId);
        return ResponseEntity.ok("Email nhắc lịch tour đã được gửi ngay!");
    }



}