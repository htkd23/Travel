package com.travel5.be.dto.request;

// BookingStatusUpdateRequest.java
import com.travel5.be.entity.BookingStatus;

public class BookingStatusUpdateRequest {
    private Integer bookingId;
    private BookingStatus status;

    // Getters and setters
    public Integer getBookingId() { return bookingId; }
    public void setBookingId(Integer bookingId) { this.bookingId = bookingId; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
}
