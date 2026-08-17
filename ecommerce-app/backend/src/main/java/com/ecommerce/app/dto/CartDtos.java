package com.ecommerce.app.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

public class CartDtos {

    @Data
    public static class AddToCartRequest {
        @NotNull
        private Long productId;
        @NotNull @Min(1)
        private Integer quantity;
    }

    @Data
    public static class UpdateCartRequest {
        @NotNull @Min(1)
        private Integer quantity;
    }

    @Data
    public static class PlaceOrderRequest {
        private String shippingAddress;
    }
}
