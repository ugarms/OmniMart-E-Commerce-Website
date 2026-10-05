package com.fashion.store.backend.repository;

import com.fashion.store.backend.model.Order;
import com.fashion.store.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
}
