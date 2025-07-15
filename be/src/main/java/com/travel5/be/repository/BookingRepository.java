package com.travel5.be.repository;

import com.travel5.be.entity.Booking;
import com.travel5.be.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Integer> {

    List<Booking> findByUserId(Integer userId);
    List<Booking> findAll(); // hoặc bạn có thể thêm paging nếu cần

    // Sửa lại truy vấn này để tính doanh thu từ discountedPrice
    @Query("SELECT MONTH(b.bookingDate), COUNT(b), SUM(b.discountedPrice) " +
            "FROM Booking b " +
            "WHERE b.status = 'CONFIRMED' " +
            "GROUP BY MONTH(b.bookingDate) " +
            "ORDER BY MONTH(b.bookingDate)")
    List<Object[]> countAndSumByMonth();

    List<Booking> findByPaymentStatus(PaymentStatus paymentStatus);

    // Sửa lại truy vấn này để tính doanh thu từ discountedPrice
    @Query("SELECT b.tour.tourName, COUNT(b), SUM(b.discountedPrice) " +
            "FROM Booking b WHERE b.status = 'CONFIRMED' " +
            "GROUP BY b.tour.tourName " +
            "ORDER BY COUNT(b) DESC")
    List<Object[]> getTourBookingStats();

    // Sửa lại truy vấn này để tính doanh thu từ discountedPrice
    @Query("SELECT b.tour.tourName, COUNT(b), SUM(b.discountedPrice), b.tour.tourId, b.tour.imagePath " +
            "FROM Booking b WHERE b.status = 'CONFIRMED' " +
            "GROUP BY b.tour.tourName, b.tour.tourId, b.tour.imagePath " +
            "ORDER BY COUNT(b) DESC")
    List<Object[]> findTopTourStats();

    @Query("SELECT b FROM Booking b JOIN FETCH b.tour WHERE b.bookingId = :bookingId")
    Optional<Booking> findByIdWithTour(@Param("bookingId") Integer bookingId);

}
