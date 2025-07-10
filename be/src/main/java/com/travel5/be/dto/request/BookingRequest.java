package com.travel5.be.dto.request;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    private Integer userId;
    private Integer tourId;
    private String fullName;
    private String email;
    private String phone;
    private String note;
    private String status;  // Thêm status nếu bạn muốn nhận từ request
    private String tourName;
    private String bankQrPath;  // nếu upload ảnh thì dùng đường dẫn ảnh
    private String bankQrCode;  // nếu frontend sinh mã text QR
    private Boolean useLoyaltyPoints = false;
    private boolean hasFeedback;

    // Thêm trường voucherCode để client có thể gửi mã voucher
    private String voucherCode; // Mã voucher mà người dùng muốn áp dụng

    // Getters and Setters
}

