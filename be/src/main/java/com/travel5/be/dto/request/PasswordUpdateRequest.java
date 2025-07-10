package com.travel5.be.dto.request;

import lombok.Data;

@Data
public class PasswordUpdateRequest {
    private String email;
    private String newPassword;
}

