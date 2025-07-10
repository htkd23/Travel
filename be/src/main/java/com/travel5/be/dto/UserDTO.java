package com.travel5.be.dto;

import java.util.Set; // Thêm import cho Set
import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.Email; // ⬅️ Thêm import này

@Data
@Getter
@Setter
@Builder
public class UserDTO {
    private Integer id;
    @NotBlank(message = "Tên người dùng không được để trống!")
    @Size(min = 3, max = 50, message = "Tên người dùng phải từ 3 đến 50 ký tự!")
    private String username;
    @NotBlank(message = "Mật khẩu không được để trống!")
    @Size(min = 8, message = "Mật khẩu phải ít nhất là 8 ký tự!")
    private String password;
    private String firstName;
    private String lastName;
    @Email(message = "Email không hợp lệ")
    private String email;
    private LocalDate dob;
    private Set<String> roles; // Vẫn dùng Set<String> trong DTO
    private Integer loyaltyPoints;

}
