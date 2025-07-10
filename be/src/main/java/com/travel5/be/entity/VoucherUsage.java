package com.travel5.be.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "voucher_usage")
public class VoucherUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer usageId;

    @ManyToOne
    @JoinColumn(name = "voucher_id", referencedColumnName = "voucherId")
    private Voucher voucher;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(name = "used_at")
    private LocalDateTime usedAt;

    // Constructor không tham số (required by JPA)
    public VoucherUsage() {
    }

    // Constructor có tham số để khởi tạo dễ dàng trong service
    public VoucherUsage(Voucher voucher, User user, LocalDateTime usedAt) {
        this.voucher = voucher;
        this.user = user;
        this.usedAt = usedAt;
    }
}
