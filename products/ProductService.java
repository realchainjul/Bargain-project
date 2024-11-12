package com.harvest.bagain.products;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductsRepository productsRepository;

    public List<Products> getProductsByCategory(String category_code) {
        return productsRepository.findByCategoryCode(category_code);
    }
}
