package com.fashion.store.backend.config;

import com.fashion.store.backend.model.Category;
import com.fashion.store.backend.model.Product;
import com.fashion.store.backend.model.Role;
import com.fashion.store.backend.model.User;
import com.fashion.store.backend.repository.CategoryRepository;
import com.fashion.store.backend.repository.ProductRepository;
import com.fashion.store.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed Default User
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setEmail("admin@omnimart.com");
            admin.setPassword(passwordEncoder.encode("password123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            System.out.println("Seeded Default User: admin@omnimart.com / password123");
        }

        // Seed Categories & Products
        Category men = getOrCreateCategory("Men", "Men's Clothing");
        Category women = getOrCreateCategory("Women", "Women's Clothing");
        Category accessories = getOrCreateCategory("Accessories", "Fashion Accessories");
        Category kids = getOrCreateCategory("Kids", "Kids' Clothing");
        Category shoes = getOrCreateCategory("Footwear", "Footwear for everyone");
        Category sports = getOrCreateCategory("Sports", "Sports Equipment & Apparel");
        Category beauty = getOrCreateCategory("Beauty", "Beauty & Personal Care");

        System.out.println("Seeded Categories");

        // Men's Products
        createProductIfNotExists("Classic Cotton T-Shirt", "A comfortable, everyday classic cotton t-shirt.", "19.99", "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80", men, "M", "White", "OmniBasics");
        createProductIfNotExists("Denim Jacket", "A stylish vintage denim jacket.", "59.99", "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80", men, "L", "Blue", "DenimCo");
        createProductIfNotExists("Formal Suit", "Elegant tailored suit for formal occasions.", "199.99", "https://images.unsplash.com/photo-1594938298596-70f56fb3ce9b?w=500&q=80", men, "42R", "Black", "Executive");
        createProductIfNotExists("Casual Chinos", "Comfortable cotton chinos for everyday wear.", "39.99", "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80", men, "32x32", "Beige", "UrbanStyle");
        createProductIfNotExists("Winter Parka", "Warm winter parka with faux fur hood.", "129.99", "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500&q=80", men, "XL", "Olive", "ArcticGear");

        // Women's Products
        createProductIfNotExists("Floral Summer Dress", "Lightweight floral dress perfect for summer.", "45.00", "https://images.unsplash.com/photo-1515347619152-16e6f0f295bc?w=500&q=80", women, "S", "Floral", "SummerVibes");
        createProductIfNotExists("Evening Gown", "Stunning evening gown for special events.", "149.99", "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500&q=80", women, "M", "Red", "Elegance");
        createProductIfNotExists("Yoga Leggings", "High-waisted stretch leggings for workouts.", "29.99", "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&q=80", women, "M", "Black", "FitPro");
        createProductIfNotExists("Silk Blouse", "Luxurious silk blouse for office or casual wear.", "55.00", "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=500&q=80", women, "L", "White", "Silk&Co");
        createProductIfNotExists("Distressed Jeans", "Trendy distressed skinny jeans.", "49.99", "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80", women, "28", "Blue", "DenimCo");

        // Accessories Products
        createProductIfNotExists("Leather Handbag", "Elegant genuine leather handbag.", "120.00", "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=500&q=80", accessories, "One Size", "Brown", "Luxe");
        createProductIfNotExists("Classic Sunglasses", "Polarized classic aviator sunglasses.", "25.00", "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80", accessories, "One Size", "Black", "Shades");
        createProductIfNotExists("Chronograph Watch", "Stylish stainless steel chronograph watch.", "199.99", "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80", accessories, "One Size", "Silver", "TimePiece");
        createProductIfNotExists("Wool Scarf", "Cozy knitted wool scarf for winter.", "15.99", "https://images.unsplash.com/photo-1606138407425-455b8dc4dfa7?w=500&q=80", accessories, "One Size", "Grey", "WinterWarm");
        createProductIfNotExists("Leather Belt", "Genuine full-grain leather belt.", "35.00", "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=500&q=80", accessories, "34", "Black", "Luxe");

        // Kids' Products
        createProductIfNotExists("Kids Graphic T-Shirt", "Fun graphic t-shirt for kids.", "14.99", "https://images.unsplash.com/photo-1519238263530-990ff3dd31fc?w=500&q=80", kids, "S", "Yellow", "KidsCo");
        createProductIfNotExists("Kids Denim Overalls", "Cute and durable denim overalls.", "29.99", "https://images.unsplash.com/photo-1519238466185-3b99480d19f4?w=500&q=80", kids, "M", "Blue", "KidsCo");
        createProductIfNotExists("Kids Raincoat", "Waterproof bright raincoat.", "39.99", "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500&q=80", kids, "L", "Yellow", "WeatherReady");
        createProductIfNotExists("Kids Sneakers", "Comfortable everyday sneakers.", "24.99", "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=500&q=80", kids, "4", "Red", "SpeedRunner");
        createProductIfNotExists("Kids Pajama Set", "Soft cotton pajama set.", "19.99", "https://images.unsplash.com/photo-1604467794349-0b74285ce7e1?w=500&q=80", kids, "M", "Blue", "SleepTight");

        // Footwear Products
        createProductIfNotExists("Running Shoes", "High performance athletic running shoes.", "89.99", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80", shoes, "10", "Red", "SpeedRunner");
        createProductIfNotExists("Leather Oxford Shoes", "Classic leather formal oxford shoes.", "110.00", "https://images.unsplash.com/photo-1614252209825-980bf13e11d2?w=500&q=80", shoes, "9", "Black", "Executive");
        createProductIfNotExists("Canvas Sneakers", "Casual everyday canvas sneakers.", "45.00", "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&q=80", shoes, "8", "White", "UrbanStyle");
        createProductIfNotExists("Hiking Boots", "Durable waterproof hiking boots.", "130.00", "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500&q=80", shoes, "11", "Brown", "AdventureGear");
        createProductIfNotExists("High Heels", "Elegant stiletto high heels.", "75.00", "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80", shoes, "7", "Black", "Elegance");

        // Sports & Beauty
        createProductIfNotExists("Yoga Mat", "Non-slip comfortable yoga mat.", "29.99", "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&q=80", sports, "Standard", "Purple", "FitPro");
        createProductIfNotExists("Dumbbell Set", "Adjustable weight dumbbell set.", "49.99", "https://images.unsplash.com/photo-1638806282806-382570dcecc7?w=500&q=80", sports, "Adjustable", "Black", "GymGear");
        createProductIfNotExists("Tennis Racket", "Professional lightweight tennis racket.", "89.99", "https://plus.unsplash.com/premium_photo-1663047240378-0e9f4eb14c8d?w=500&q=80", sports, "L", "Blue", "CourtPro");

        createProductIfNotExists("Skincare Set", "Complete organic skincare set.", "65.00", "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80", beauty, "One Size", "White", "GlowNaturals");
        createProductIfNotExists("Matte Lipstick", "Long-lasting matte lipstick.", "15.99", "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80", beauty, "One Size", "Ruby Red", "Glamour");
        createProductIfNotExists("Perfume", "Elegant floral scent perfume.", "75.00", "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&q=80", beauty, "50ml", "Clear", "Aroma");

        System.out.println("Seeded Products");
    }

    private Category getOrCreateCategory(String name, String description) {
        return categoryRepository.findByName(name).orElseGet(() -> {
            Category category = new Category();
            category.setName(name);
            category.setDescription(description);
            return categoryRepository.save(category);
        });
    }

    private void createProductIfNotExists(String name, String description, String price, String imageUrl, Category category, String size, String color, String brand) {
        if (!productRepository.existsByName(name)) {
            Product p = new Product();
            p.setName(name);
            p.setDescription(description);
            p.setPrice(new BigDecimal(price));
            p.setImageUrl(imageUrl);
            p.setCategory(category);
            p.setSize(size);
            p.setColor(color);
            p.setBrand(brand);
            productRepository.save(p);
        }
    }
}
