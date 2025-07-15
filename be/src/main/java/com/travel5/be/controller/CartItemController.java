package com.travel5.be.controller;

import com.travel5.be.dto.request.CartRequest;
import com.travel5.be.entity.CartItem;
import com.travel5.be.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartItemController {

    @Autowired
    private CartService cartService;

    /**
     * Thêm tour vào giỏ hàng.
     */
    @PostMapping("/add")
    public CartItem addToCart(@RequestBody CartRequest request) {
        try {
            return cartService.addToCart(
                    request.getUserId(),
                    request.getTourId(),
                    request.getQuantity()
            );
        } catch (RuntimeException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, e.getMessage()
            );
        }
    }

    /**
     * Cập nhật số lượng tour trong giỏ hàng.
     * Nếu quantity = 0 thì xóa luôn.
     */
    @PutMapping("/update-quantity")
    public CartItem updateQuantity(@RequestBody CartRequest request) {
        return cartService.updateQuantity(
                request.getUserId(),
                request.getTourId(),
                request.getQuantity()
        );
    }

    @GetMapping("/{userId}")
    public List<CartItem> getCartItems(@PathVariable Integer userId) {
        return cartService.getCartItems(userId);
    }

    @DeleteMapping("/remove")
    public void removeCartItem(@RequestParam Integer userId, @RequestParam Integer tourId) {
        cartService.removeFromCart(userId, tourId);
    }
}
