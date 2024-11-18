package com.harvest.bagain.products;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/category")
public class ProductsController {
    @Autowired
    private ProductsDAO productsDAO;

    // 카테고리 이름으로 상품 목록 조회
    @GetMapping("/{categoryName}")
    public List<Products> getProductsByCategoryName(@PathVariable String categoryName) {
        return productsDAO.getProductsByCategoryName(categoryName);
    }
}
