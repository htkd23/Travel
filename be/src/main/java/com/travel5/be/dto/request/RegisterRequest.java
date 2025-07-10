package com.travel5.be.dto.request;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;


@Data
@Getter
@Setter
public class RegisterRequest {
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private String email;
    private LocalDate dob;
    // Getters and setters
}
