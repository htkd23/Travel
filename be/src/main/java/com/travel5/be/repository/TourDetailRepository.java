package com.travel5.be.repository;

import com.travel5.be.entity.TourDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TourDetailRepository extends JpaRepository<TourDetail, Integer> {
    TourDetail findByTour_TourId(Integer tourId);
}
