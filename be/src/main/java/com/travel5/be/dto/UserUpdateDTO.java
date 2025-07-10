package com.travel5.be.dto;

import jakarta.validation.constraints.Email;
import lombok.Data;
import java.time.LocalDate;

@Data
public class UserUpdateDTO {
    private String firstName;
    private String lastName;
    private String email;
    private LocalDate dob;
}
