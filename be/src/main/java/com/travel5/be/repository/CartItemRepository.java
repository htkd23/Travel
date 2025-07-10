package com.travel5.be.repository;

import com.travel5.be.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    Optional<CartItem> findByUser_IdAndTour_TourId(Integer userId, Integer tourId);
    List<CartItem> findByUser_Id(Integer userId);
    void deleteByUser_IdAndTour_TourId(Integer userId, Integer tourId);
}




