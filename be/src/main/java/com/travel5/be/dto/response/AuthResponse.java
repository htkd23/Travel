package com.travel5.be.dto.response;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class AuthResponse {
    private String token;
    public AuthResponse(String token) { this.token = token; }
}