package com.travel5.be.dto.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class FeedbackSearchRequest {
    private String tourName;
    private String userName;
    private LocalDate createdDateFrom;
    private LocalDate createdDateTo;
}

