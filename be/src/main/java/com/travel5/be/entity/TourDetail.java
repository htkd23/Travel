package com.travel5.be.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tour_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TourDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "tour_id", referencedColumnName = "tourId")
    @JsonBackReference
    private Tour tour;

    @Column(columnDefinition = "TEXT")
    private String introduction;

    @Column(columnDefinition = "TEXT")
    private String itinerary;

    @Column(columnDefinition = "TEXT")
    private String reviews;

    @Column(columnDefinition = "TEXT")
    private String policy;

    @Column(name = "created_at", updatable = false, insertable = false)
    private java.sql.Timestamp createdAt;

    @Column(name = "updated_at", insertable = false)
    private java.sql.Timestamp updatedAt;
}
