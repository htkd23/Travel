package com.travel5.be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackResponse {
    private Integer id;
    private Integer bookingId;
    private Integer userId;
    private String userFullName;
    private Integer tourId;
    private String tourName;
    private String content;
    private LocalDateTime createdAt;
}

