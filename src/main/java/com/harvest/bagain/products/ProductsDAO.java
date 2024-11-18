package com.harvest.bagain.products;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.harvest.bagain.category.Category;
import com.harvest.bagain.category.CategoryRepository;

@Service
public class ProductsDAO {

    @Autowired
    private CategoryRepository cateRepo;

    @Autowired
    private ProductsRepository prodRepo;

    // 카테고리 이름으로 상품 목록 조회
    public List<Products> getProductsByCategoryName(String categoryName) {
        Optional<Category> category = cateRepo.findByName(categoryName); // 수정된 메소드 사용
        if (category.isPresent()) {
            return prodRepo.findByCategory(category.get()); // Category 객체를 전달
        } else {
            return new ArrayList<>();
        }
    }
}
