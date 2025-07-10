// TourDTO.java
package com.travel5.be.dto;

import com.travel5.be.entity.TourType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TourDTO {
    private Integer tourId;
    private String tourName;
    private String description;
    private String location;
    private BigDecimal price;
    private String startDate;
    private String endDate;
    private String imagePath;
    private TourType tourType;
    private Integer voucherId;  // ID của voucher để áp dụng vào tour

    private TourDetailDTO tourDetail; // chứa DTO chi tiết tour

    // Getters and Setters
}

