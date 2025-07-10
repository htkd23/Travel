package com.travel5.be.dto.request;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class PasswordResetRequest {
    @Email
    private String email;
}
