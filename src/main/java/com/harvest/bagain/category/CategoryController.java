package com.harvest.bagain.category;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.harvest.bagain.products.Products;
import com.harvest.bagain.products.ProductsDAO;

import java.util.List;

@RestController
@RequestMapping("/category")
public class CategoryController {

    @Autowired
    private ProductsDAO productsDAO;

    // 카테고리 이름으로 상품 목록 조회
    @GetMapping("/{categoryName}")
    public ResponseEntity<List<Products>> getProductsByCategory(@PathVariable String categoryName) {
        List<Products> productsList = productsDAO.getProductsByCategoryName(categoryName);
        return ResponseEntity.ok(productsList);
    }
}
