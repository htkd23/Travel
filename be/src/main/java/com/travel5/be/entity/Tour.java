package com.travel5.be.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "tours")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EntityListeners(AuditingEntityListener.class) // Kích hoạt Auditing
public class Tour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer tourId;

    @Column(name = "tour_name", nullable = false)
    private String tourName;

    private String description;
    private String location;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @ManyToOne
    @JoinColumn(name = "voucher_id")
    private Voucher voucher;  // Liên kết voucher với tour

    private LocalDate startDate;
    private LocalDate endDate;

    @Column(name = "image_path", length = 500)
    private String imagePath;

    @Enumerated(EnumType.STRING)
    @Column(name = "tour_activity_status", nullable = false)
    private TourActivityStatus status = TourActivityStatus.ACTIVE;  // Mặc định là ACTIVE

    @Enumerated(EnumType.STRING)
    @Column(name = "tour_type", nullable = false)
    private TourType tourType;

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Tour(String tourName, String location, String description, BigDecimal price, LocalDate startDate, LocalDate endDate, String imagePath, TourType tourType) {
        this.tourName = tourName;
        this.description = description;
        this.location = location;
        this.price = price;
        this.startDate = startDate;
        this.endDate = endDate;
        this.imagePath = imagePath;
        this.tourType = tourType;
    }

    @OneToOne(mappedBy = "tour", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private TourDetail tourDetail;

    // Phương thức kiểm tra trạng thái tour khi lưu hoặc cập nhật
    @PrePersist
    @PreUpdate
    public void checkTourStatus() {
        if (this.startDate != null && LocalDate.now().isAfter(this.startDate)) {
            this.status = TourActivityStatus.INACTIVE;  // Cập nhật trạng thái nếu ngày bắt đầu nhỏ hơn ngày hiện tại
        } else {
            this.status = TourActivityStatus.ACTIVE;  // Nếu không thì tour đang hoạt động
        }
    }

    // Getter và Setter sẽ được Lombok tự động tạo ra vì đã có annotation @Getter @Setter
}
