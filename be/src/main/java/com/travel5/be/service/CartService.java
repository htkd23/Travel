package com.travel5.be.service;

import com.travel5.be.entity.CartItem;
import com.travel5.be.entity.Tour;
import com.travel5.be.entity.User;
import com.travel5.be.repository.CartItemRepository;
import com.travel5.be.repository.TourRepository;
import com.travel5.be.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private UserRepository userRepository;

    public CartItem addToCart(Integer userId, Integer tourId) {
        Optional<CartItem> existing = cartItemRepository.findByUser_IdAndTour_TourId(userId, tourId);
        if (existing.isPresent()) {
            throw new RuntimeException("Tour này đã có trong giỏ hàng.");
        }

        User user = userRepository.findById(userId).orElseThrow();
        Tour tour = tourRepository.findById(tourId).orElseThrow();

        CartItem item = new CartItem();
        item.setUser(user);
        item.setTour(tour);
        return cartItemRepository.save(item);
    }

    public List<CartItem> getCartItems(Integer userId) {
        return cartItemRepository.findByUser_Id(userId);
    }

    @Transactional
    public void removeFromCart(Integer userId, Integer tourId) {
        cartItemRepository.deleteByUser_IdAndTour_TourId(userId, tourId);
    }
}
