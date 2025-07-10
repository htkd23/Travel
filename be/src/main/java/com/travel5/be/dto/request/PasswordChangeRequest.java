package com.travel5.be.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordChangeRequest {
    private String oldPassword;
    private String newPassword;
}

