package com.travel5.be.controller;

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

    @PostMapping("/add")
    public CartItem addToCart(@RequestParam Integer userId, @RequestParam Integer tourId) {
        try {
            return cartService.addToCart(userId, tourId);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, e.getMessage()
            );
        }
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
