package com.travel5.be.entity;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set; // ✅ NHỚ import

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "users")
@Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class User{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;
    String username;
    String password;
    String firstName;
    String lastName;
    String email;
    LocalDate dob;

    @Column(name = "loyalty_points")
    private Integer loyaltyPoints = 0;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    @JsonProperty("loyaltyPoints")
    public Integer getLoyaltyPointsSafe() {
        return loyaltyPoints != null ? loyaltyPoints : 0;
    }

}