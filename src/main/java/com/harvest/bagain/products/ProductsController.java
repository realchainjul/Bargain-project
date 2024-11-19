package com.harvest.bagain.products;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/mypage/userpage/")
public class ProductsController {

    @Autowired
    private ProductsDAO productsDAO;

    // 상품 등록
    @PostMapping("/productadd")
    public ResponseEntity<Map<String, Object>> addProduct(
            @Validated @ModelAttribute ProductsAddReq req,
            @RequestParam(required = false) MultipartFile photo,
            @RequestParam(required = false) MultipartFile[] commentphoto) {

        Map<String, Object> result = productsDAO.addProduct(req, photo, commentphoto);
        return ResponseEntity.ok(result);
    }
}