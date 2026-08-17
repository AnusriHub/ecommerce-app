package com.ecommerce.app.controller;

import com.ecommerce.app.dto.CartDtos.PlaceOrderRequest;
import com.ecommerce.app.model.Order;
import com.ecommerce.app.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/{userId}")
    @ResponseStatus(HttpStatus.CREATED)
    public Order placeOrder(@PathVariable Long userId, @RequestBody(required = false) PlaceOrderRequest request) {
        String address = request != null ? request.getShippingAddress() : null;
        return orderService.placeOrder(userId, address);
    }

    @GetMapping("/user/{userId}")
    public List<Order> getOrdersForUser(@PathVariable Long userId) {
        return orderService.getOrdersForUser(userId);
    }

    @GetMapping("/{orderId}")
    public Order getOrder(@PathVariable Long orderId) {
        return orderService.getOrderById(orderId);
    }

    // Admin: view all orders / update status
    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @PutMapping("/{orderId}/status")
    public Order updateStatus(@PathVariable Long orderId, @RequestBody Map<String, String> body) {
        return orderService.updateStatus(orderId, body.get("status"));
    }
}
