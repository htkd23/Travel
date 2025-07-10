package com.travel5.be.repository;

import com.travel5.be.entity.ScheduledEmail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ScheduledEmailRepository extends JpaRepository<ScheduledEmail, Integer> {
    List<ScheduledEmail> findByIsSentFalseAndScheduledTimeBefore(LocalDateTime now);
    List<ScheduledEmail> findByIsSentFalse();

    Optional<ScheduledEmail> findByBooking_BookingId(Integer bookingId);
}

