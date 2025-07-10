package com.travel5.be.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class HotelDTO {
    private String hotelName;
    private String address;
    private Double rating;
    private String description;
    private String highlight;
    private String facilities;
    private String hotelType;
    private String suitableFor;
    private BigDecimal priceStart;
}

