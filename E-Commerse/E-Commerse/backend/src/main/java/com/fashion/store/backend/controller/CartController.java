package com.fashion.store.backend.controller;

import com.fashion.store.backend.model.CartItem;
import com.fashion.store.backend.model.Product;
import com.fashion.store.backend.model.User;
import com.fashion.store.backend.repository.CartItemRepository;
import com.fashion.store.backend.repository.ProductRepository;
import com.fashion.store.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart() {
        return ResponseEntity.ok(cartItemRepository.findByUser(getCurrentUser()));
    }

    @PostMapping("/add/{productId}")
    public ResponseEntity<CartItem> addToCart(@PathVariable Long productId, @RequestParam(defaultValue = "1") Integer quantity) {
        User user = getCurrentUser();
        Product product = productRepository.findById(productId).orElseThrow();
        
        CartItem cartItem = cartItemRepository.findByUserAndProduct(user, product);
        if (cartItem != null) {
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        } else {
            cartItem = new CartItem();
            cartItem.setUser(user);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
        }
        
        return ResponseEntity.ok(cartItemRepository.save(cartItem));
    }
    
    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
        return ResponseEntity.ok().build();
    }

    @Transactional
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart() {
        cartItemRepository.deleteByUser(getCurrentUser());
        return ResponseEntity.ok().build();
    }
}
