package com.fashion.store.backend.repository;

import com.fashion.store.backend.model.CartItem;
import com.fashion.store.backend.model.User;
import com.fashion.store.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    CartItem findByUserAndProduct(User user, Product product);
    void deleteByUser(User user);
}
