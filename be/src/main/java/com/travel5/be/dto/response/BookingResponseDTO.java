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
    private BigDecimal discountedPrice;
    private String bankQrCode;
    private PaymentStatus paymentStatus;
    private Integer loyaltyPoints;
    private BigDecimal tourPrice;

    private String tourName;
    private String tourLocation;
    private String userFullName;
    private String userEmail;

    private boolean hasFeedback;

}
