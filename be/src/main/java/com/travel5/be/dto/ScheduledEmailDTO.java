package com.travel5.be.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class ScheduledEmailDTO {
    private Integer bookingId;
    private String tourName;
    private String customerName;
    private BigDecimal pricePaid;
    private LocalDate departureDate;
    private boolean isSent;
}
