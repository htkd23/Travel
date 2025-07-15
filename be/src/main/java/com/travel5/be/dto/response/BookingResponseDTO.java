package com.travel5.be.dto.response;

import com.travel5.be.entity.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BookingResponseDTO {
    private Integer bookingId;
    private String fullName;
    private String email;
    private String phone;
    private String note;
    private BigDecimal discountedPrice;  // Giá đã giảm
    private BigDecimal displayPrice;     // Giá hiển thị (giảm hoặc gốc)
    private String bankQrCode;
    private PaymentStatus paymentStatus;
    private Integer loyaltyPoints;
    private BigDecimal tourPrice; // Giá gốc của tour

    private String tourName;
    private String tourLocation;
    private String tourImagePath;
    private String userFullName;
    private String userEmail;

    private boolean hasFeedback;

    // ✅ Constructor đầy đủ
    public BookingResponseDTO(
            Integer bookingId,
            String fullName,
            String email,
            String phone,
            String note,
            BigDecimal discountedPrice,
            String bankQrCode,
            PaymentStatus paymentStatus,
            Integer loyaltyPoints,
            BigDecimal tourPrice,
            String tourName,
            String tourLocation,
            String tourImagePath,             // ✅ THÊM THAM SỐ NÀY
            String userFullName,
            String userEmail,
            boolean hasFeedback
    ) {
        this.bookingId = bookingId;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.note = note;
        this.discountedPrice = discountedPrice;
        this.bankQrCode = bankQrCode;
        this.paymentStatus = paymentStatus;
        this.loyaltyPoints = loyaltyPoints;
        this.tourPrice = tourPrice;
        this.tourName = tourName;
        this.tourLocation = tourLocation;
        this.tourImagePath = tourImagePath;   // ✅ GÁN VÀO FIELD
        this.userFullName = userFullName;
        this.userEmail = userEmail;
        this.hasFeedback = hasFeedback;

        this.displayPrice = discountedPrice != null
                ? discountedPrice
                : (tourPrice != null ? tourPrice : BigDecimal.ZERO);
    }
}
