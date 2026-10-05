package com.fashion.store.backend.service;

import com.fashion.store.backend.model.Product;
import com.fashion.store.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public Page<Product> getProducts(
            String category, String size, String color, String material,
            String style, String brand, String pattern,
            BigDecimal minPrice, BigDecimal maxPrice,
            Pageable pageable) {

        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (category != null && !category.isEmpty()) {
                predicates.add(cb.equal(root.join("category").get("name"), category));
            }
            if (size != null && !size.isEmpty()) {
                predicates.add(cb.equal(root.get("size"), size));
            }
            if (color != null && !color.isEmpty()) {
                predicates.add(cb.equal(root.get("color"), color));
            }
            if (material != null && !material.isEmpty()) {
                predicates.add(cb.equal(root.get("material"), material));
            }
            if (style != null && !style.isEmpty()) {
                predicates.add(cb.equal(root.get("style"), style));
            }
            if (brand != null && !brand.isEmpty()) {
                predicates.add(cb.equal(root.get("brand"), brand));
            }
            if (pattern != null && !pattern.isEmpty()) {
                predicates.add(cb.equal(root.get("pattern"), pattern));
            }
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return productRepository.findAll(spec, pageable);
    }
    
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
