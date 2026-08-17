package com.ecommerce.app.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class AuthDtos {

    @Data
    public static class RegisterRequest {
        @NotBlank
        private String fullName;
        @NotBlank @Email
        private String email;
        @NotBlank
        private String password;
        private String address;
    }

    @Data
    public static class LoginRequest {
        @NotBlank @Email
        private String email;
        @NotBlank
        private String password;
    }
}
