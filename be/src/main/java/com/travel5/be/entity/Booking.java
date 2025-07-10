package com.travel5.be.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer bookingId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "roles"}) // ⬅️ để tránh lỗi serialization
    private User user;

    @ManyToOne
    @JoinColumn(name = "tour_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "tourDetail"})
    private Tour tour;

    private String fullName;
    private String email;
    private String phone;
    private String note;

    @Column(name = "booking_date")
    private LocalDateTime bookingDate = LocalDateTime.now();
    @Column(name = "bank_qr_path")
    private String bankQrPath;

    @Column(name = "bank_qr_code", columnDefinition = "TEXT")
    private String bankQrCode;

    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus = PaymentStatus.UNPAID;

    @Column(name = "discounted_price")
    private BigDecimal discountedPrice;

    @Column(name = "has_feedback")
    private boolean hasFeedback = false;


}
