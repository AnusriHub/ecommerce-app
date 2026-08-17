package com.ecommerce.app.service;

import com.ecommerce.app.exception.ApiException;
import com.ecommerce.app.model.*;
import com.ecommerce.app.repository.CartItemRepository;
import com.ecommerce.app.repository.OrderRepository;
import com.ecommerce.app.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    @Transactional
    public Order placeOrder(Long userId, String shippingAddress) {
        User user = userService.getUserById(userId);
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);

        if (cartItems.isEmpty()) {
            throw new ApiException("Your cart is empty", HttpStatus.BAD_REQUEST);
        }

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(shippingAddress != null ? shippingAddress : user.getAddress());
        order.setStatus("PLACED");

        BigDecimal total = BigDecimal.ZERO;

        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();

            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new ApiException("Insufficient stock for " + product.getName(), HttpStatus.BAD_REQUEST);
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPriceAtPurchase(product.getPrice());
            order.getItems().add(orderItem);

            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));

            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);
        }

        order.setTotalAmount(total);
        Order saved = orderRepository.save(order);

        cartItemRepository.deleteByUserId(userId);

        return saved;
    }

    public List<Order> getOrdersForUser(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ApiException("Order not found", HttpStatus.NOT_FOUND));
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order updateStatus(Long orderId, String status) {
        Order order = getOrderById(orderId);
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
