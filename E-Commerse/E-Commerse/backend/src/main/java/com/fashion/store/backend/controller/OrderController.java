package com.fashion.store.backend.controller;

import com.fashion.store.backend.model.Order;
import com.fashion.store.backend.model.User;
import com.fashion.store.backend.repository.UserRepository;
import com.fashion.store.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout() {
        return ResponseEntity.ok(orderService.createOrder(getCurrentUser()));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getMyOrders() {
        return ResponseEntity.ok(orderService.getUserOrders(getCurrentUser()));
    }
}
