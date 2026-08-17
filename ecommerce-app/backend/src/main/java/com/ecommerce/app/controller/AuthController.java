package com.ecommerce.app.controller;

import com.ecommerce.app.dto.AuthDtos.LoginRequest;
import com.ecommerce.app.dto.AuthDtos.RegisterRequest;
import com.ecommerce.app.model.User;
import com.ecommerce.app.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public User register(@Valid @RequestBody RegisterRequest request) {
        return userService.register(request);
    }

    @PostMapping("/login")
    public User login(@Valid @RequestBody LoginRequest request) {
        // Simple demo auth: returns the user object (without password) on success.
        // The frontend stores the returned user id/email in localStorage as a lightweight "session".
        // For production, replace this with JWT or Spring Security session-based auth.
        return userService.login(request);
    }
}
