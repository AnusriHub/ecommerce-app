package com.ecommerce.app.service;

import com.ecommerce.app.exception.ApiException;
import com.ecommerce.app.model.Product;
import com.ecommerce.app.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ApiException("Product not found with id: " + id, HttpStatus.NOT_FOUND));
    }

    public List<Product> getByCategory(String category) {
        return productRepository.findByCategoryIgnoreCase(category);
    }

    public List<Product> search(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product updated) {
        Product existing = getProductById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setStockQuantity(updated.getStockQuantity());
        existing.setCategory(updated.getCategory());
        existing.setImageUrl(updated.getImageUrl());
        return productRepository.save(existing);
    }

    public void deleteProduct(Long id) {
        Product existing = getProductById(id);
        productRepository.delete(existing);
    }
}
