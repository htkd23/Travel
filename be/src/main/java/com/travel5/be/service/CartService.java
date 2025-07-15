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

    /**
     * Thêm tour vào giỏ hàng.
     * Nếu đã tồn tại thì tăng số lượng.
     */
    public CartItem addToCart(Integer userId, Integer tourId, Integer quantity) {
        Optional<CartItem> existing = cartItemRepository.findByUser_IdAndTour_TourId(userId, tourId);

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + (quantity != null ? quantity : 1));
            return cartItemRepository.save(item);
        }

        User user = userRepository.findById(userId).orElseThrow(() ->
                new RuntimeException("Không tìm thấy người dùng với id " + userId));
        Tour tour = tourRepository.findById(tourId).orElseThrow(() ->
                new RuntimeException("Không tìm thấy tour với id " + tourId));

        CartItem item = new CartItem();
        item.setUser(user);
        item.setTour(tour);
        item.setQuantity(quantity != null ? quantity : 1);

        return cartItemRepository.save(item);
    }

    /**
     * Cập nhật quantity của tour trong giỏ hàng.
     * Nếu quantity = 0 thì xóa khỏi giỏ hàng.
     */
    @Transactional
    public CartItem updateQuantity(Integer userId, Integer tourId, Integer quantity) {
        CartItem item = cartItemRepository.findByUser_IdAndTour_TourId(userId, tourId)
                .orElseThrow(() -> new RuntimeException("Tour này chưa có trong giỏ hàng."));

        if (quantity <= 0) {
            cartItemRepository.delete(item);
            return null;
        }

        item.setQuantity(quantity);
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
