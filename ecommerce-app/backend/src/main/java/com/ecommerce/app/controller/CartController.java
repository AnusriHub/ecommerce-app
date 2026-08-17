package com.ecommerce.app.controller;

import com.ecommerce.app.dto.CartDtos.AddToCartRequest;
import com.ecommerce.app.dto.CartDtos.UpdateCartRequest;
import com.ecommerce.app.model.CartItem;
import com.ecommerce.app.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping("/{userId}")
    public List<CartItem> getCart(@PathVariable Long userId) {
        return cartService.getCart(userId);
    }

    @PostMapping("/{userId}")
    public CartItem addToCart(@PathVariable Long userId, @Valid @RequestBody AddToCartRequest request) {
        return cartService.addToCart(userId, request);
    }

    @PutMapping("/{userId}/item/{cartItemId}")
    public CartItem updateItem(@PathVariable Long userId, @PathVariable Long cartItemId,
                                @Valid @RequestBody UpdateCartRequest request) {
        return cartService.updateQuantity(userId, cartItemId, request.getQuantity());
    }

    @DeleteMapping("/{userId}/item/{cartItemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeItem(@PathVariable Long userId, @PathVariable Long cartItemId) {
        cartService.removeItem(userId, cartItemId);
    }

    @DeleteMapping("/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
    }
}
