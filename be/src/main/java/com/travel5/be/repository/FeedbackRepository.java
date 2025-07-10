package com.travel5.be.repository;

import com.travel5.be.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {

    @Query("""
            SELECT f
            FROM Feedback f
            WHERE 
                (:tourName IS NULL OR LOWER(f.tour.tourName) LIKE %:tourName%) AND
                (
                    :userName IS NULL OR
                    LOWER(CONCAT(f.user.firstName, ' ', f.user.lastName)) LIKE %:userName%
                ) AND
                (:createdDateFrom IS NULL OR f.createdAt >= :createdDateFrom) AND
                (:createdDateTo IS NULL OR f.createdAt <= :createdDateTo)
            """)
    List<Feedback> searchFeedbacks(
            @Param("tourName") String tourName,
            @Param("userName") String userName,
            @Param("createdDateFrom") LocalDate createdDateFrom,
            @Param("createdDateTo") LocalDate createdDateTo
    );

    List<Feedback> findByTour_TourId(Integer tourId);
    List<Feedback> findByUser_Id(Integer userId);
}
