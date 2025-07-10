package com.travel5.be.dto.request;

import lombok.Data;

@Data
public class OTPVerificationRequest {
    private String email;
    private String otp;
}

