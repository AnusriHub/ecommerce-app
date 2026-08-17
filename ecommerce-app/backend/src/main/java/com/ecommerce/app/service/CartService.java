package com.ecommerce.app.service;

import com.ecommerce.app.dto.CartDtos.AddToCartRequest;
import com.ecommerce.app.exception.ApiException;
import com.ecommerce.app.model.CartItem;
import com.ecommerce.app.model.Product;
import com.ecommerce.app.model.User;
import com.ecommerce.app.repository.CartItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final UserService userService;
    private final ProductService productService;

    public List<CartItem> getCart(Long userId) {
        return cartItemRepository.findByUserId(userId);
    }

    public CartItem addToCart(Long userId, AddToCartRequest request) {
        User user = userService.getUserById(userId);
        Product product = productService.getProductById(request.getProductId());

        if (product.getStockQuantity() < request.getQuantity()) {
            throw new ApiException("Not enough stock for " + product.getName(), HttpStatus.BAD_REQUEST);
        }

        CartItem item = cartItemRepository.findByUserIdAndProductId(userId, request.getProductId())
                .orElse(new CartItem(null, user, product, 0));

        item.setQuantity(item.getQuantity() + request.getQuantity());
        return cartItemRepository.save(item);
    }

    public CartItem updateQuantity(Long userId, Long cartItemId, Integer quantity) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ApiException("Cart item not found", HttpStatus.NOT_FOUND));

        if (!item.getUser().getId().equals(userId)) {
            throw new ApiException("Not authorized to modify this cart item", HttpStatus.FORBIDDEN);
        }

        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

    public void removeItem(Long userId, Long cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ApiException("Cart item not found", HttpStatus.NOT_FOUND));

        if (!item.getUser().getId().equals(userId)) {
            throw new ApiException("Not authorized to modify this cart item", HttpStatus.FORBIDDEN);
        }

        cartItemRepository.delete(item);
    }

    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }
}
