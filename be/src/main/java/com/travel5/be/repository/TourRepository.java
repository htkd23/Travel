package com.travel5.be.repository;

import java.time.LocalDate;
import java.util.List;

import com.travel5.be.entity.TourActivityStatus;
import com.travel5.be.entity.TourType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.travel5.be.entity.Tour;

@Repository
public interface TourRepository extends JpaRepository<Tour, Integer> {
    @Query("SELECT t FROM Tour t WHERE " +
            "(:departureDate IS NULL OR t.startDate >= :departureDate) " +
            "AND (:price IS NULL OR CAST(t.price AS double) <= CAST(:price AS double))")
    List<Tour> findByDateAndPrice(LocalDate departureDate, String price);

    @Query("SELECT COUNT(t) FROM Tour t WHERE t.tourType = :tourType")
    long countToursByType(@Param("tourType") TourType tourType);

    // Trong TourRepository.java
    @Query("SELECT t FROM Tour t WHERE t.status = :status")
    List<Tour> findToursByStatus(@Param("status") TourActivityStatus status);

}

