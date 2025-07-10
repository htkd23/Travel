package com.travel5.be.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    private Map<String, String> otpStorage = new HashMap<>();

    public void sendOTP(String toEmail) {
        String otp = generateOTP();
        otpStorage.put(toEmail, otp);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Mã OTP để đặt lại mật khẩu");
        message.setText("Mã OTP của bạn là: " + otp);

        mailSender.send(message);
    }

    public boolean verifyOTP(String email, String otp) {
        return otpStorage.containsKey(email) && otpStorage.get(email).equals(otp);
    }

    public void removeOTP(String email) {
        otpStorage.remove(email);
    }

    private String generateOTP() {
        return String.valueOf(new Random().nextInt(900000) + 100000);
    }
}

