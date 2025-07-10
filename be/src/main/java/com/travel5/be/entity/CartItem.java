package com.travel5.be.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "cart_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Người dùng thêm vào giỏ
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Tour được thêm
    @ManyToOne
    @JoinColumn(name = "tour_id")
    private Tour tour;

    private Integer quantity = 1;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
