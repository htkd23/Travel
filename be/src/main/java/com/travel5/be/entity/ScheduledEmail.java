package com.travel5.be.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "scheduled_emails")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ScheduledEmail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    private LocalDateTime scheduledTime;

    private boolean isSent = false;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
