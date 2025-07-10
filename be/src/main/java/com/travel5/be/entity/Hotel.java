package com.travel5.be.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "hotels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer hotelId;

    @Column(nullable = false)
    private String hotelName;

    private String address;
    private Double rating;
    private String description;
    private String highlight;
    private String facilities;
    private String hotelType;
    private String suitableFor;

    @Column(precision = 10, scale = 3)
    private BigDecimal priceStart;

    private String imagePath;

    @Column(name = "created_at", updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private java.sql.Timestamp createdAt;
}
