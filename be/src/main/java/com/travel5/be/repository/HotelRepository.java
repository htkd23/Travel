package com.travel5.be.repository;

import com.travel5.be.entity.Booking;
import com.travel5.be.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Integer> {
    List<Hotel> findByHotelNameLikeOrAddressLikeOrDescriptionLike(String hotelName, String address, String description);
}



