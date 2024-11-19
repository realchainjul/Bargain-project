package com.harvest.bagain.products;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class ProductsController {

	@Autowired
	private ProductsDAO productsDAO;

	// 상품 등록
	@PostMapping("/mypage/userpage/productadd")
	public ResponseEntity<Map<String, Object>> addProduct(@Validated @ModelAttribute ProductsAddReq req,
			@RequestParam(required = false) MultipartFile photo,
			@RequestParam(required = false) MultipartFile[] commentphoto) {

		Map<String, Object> result = productsDAO.addProduct(req, photo, commentphoto);
		return ResponseEntity.ok(result);
	}

	// 상품 찜하기
	@PostMapping("/products/{productCode}/liked")
	public ResponseEntity<Map<String, Object>> toggleLikeProduct(@PathVariable Integer productCode,
			@RequestParam Integer userCode) {
		Map<String, Object> response = productsDAO.toggleLikeProduct(productCode, userCode);
		return ResponseEntity.ok(response);
	}
}