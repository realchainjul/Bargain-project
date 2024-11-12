package com.harvest.bagain.products;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductsController {
    @Autowired
    private ProductService productService;

    // 상품 API 호출 '/api/products/category/${category}'
    // category는 category 테이블의 category_code로 구별
    // 해당 카테고리의 상품들을 목록으로 불러오는 API입니다
    // product의 photo는 img key={photo.id} src={photo.photoUrl} alt={`${product.name} photo`} 이런식으로 하시면 됩니다.
    @GetMapping("/category/{categoryCode}")
    public List<Products> getProductsByCategory(@PathVariable String category_code) {
        return productService.getProductsByCategory(category_code);
    }
}