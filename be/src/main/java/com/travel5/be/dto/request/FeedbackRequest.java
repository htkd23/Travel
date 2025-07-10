package com.travel5.be.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackRequest {
    private Integer bookingId;
    private Integer userId;
    private Integer tourId;
    private String content;
}

