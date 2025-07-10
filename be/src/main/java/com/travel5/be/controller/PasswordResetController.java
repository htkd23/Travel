package com.travel5.be.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travel5.be.dto.request.OTPVerificationRequest;
import com.travel5.be.dto.request.PasswordResetRequest;
import com.travel5.be.dto.request.PasswordUpdateRequest;
import com.travel5.be.service.EmailService;
import com.travel5.be.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class PasswordResetController {

    private final EmailService emailService;
    private final UserService userService;

    @PostMapping("/forgot-password")
    public ResponseEntity<?> sendOtp(@RequestBody @Valid PasswordResetRequest request) {
        emailService.sendOTP(request.getEmail());
        return ResponseEntity.ok("Đã gửi OTP tới email");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OTPVerificationRequest request) {
        boolean verified = emailService.verifyOTP(request.getEmail(), request.getOtp());
        if (verified) {
            return ResponseEntity.ok("OTP hợp lệ");
        } else {
            return ResponseEntity.badRequest().body("OTP không đúng");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordUpdateRequest request) {
        userService.updatePassword(request.getEmail(), request.getNewPassword());
        emailService.removeOTP(request.getEmail());
        return ResponseEntity.ok("Cập nhật mật khẩu thành công");
    }
}
