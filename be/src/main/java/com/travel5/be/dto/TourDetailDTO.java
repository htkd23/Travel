package com.travel5.be.dto;

import com.travel5.be.entity.TourType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TourDetailDTO {
    private Integer id;
    private String introduction;
    private String itinerary;
    private String reviews;
    private String policy;
}

