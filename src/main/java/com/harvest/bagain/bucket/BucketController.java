package com.harvest.bagain.bucket;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.harvest.bagain.products.Products;
import com.harvest.bagain.products.ProductsRepository;
import com.harvest.bagain.users.Users;

import jakarta.servlet.http.HttpSession;

@RestController
public class BucketController {

	@Autowired
	private BucketDAO bucketDAO;

	@Autowired
	private ProductsRepository prodRepo;

	// 장바구니에 상품 추가
	@PostMapping("/products/{productCode}/bucket/add")
	public ResponseEntity<Map<String, Object>> addProductToBucket(@PathVariable Integer productCode,
			@RequestParam Integer count, HttpSession session) {
		Users user = (Users) session.getAttribute("loginMember");
		if (user == null) {
			return ResponseEntity.status(401).body(Map.of("status", false, "message", "로그인이 필요합니다."));
		}
		Optional<Products> productOpt = prodRepo.findById(productCode);
		if (productOpt.isEmpty()) {
			return ResponseEntity.status(404).body(Map.of("status", false, "message", "유효하지 않은 상품 코드입니다."));
		}
		Map<String, Object> response = bucketDAO.addProductToBucket(user, productOpt.get(), count);
		return ResponseEntity.ok(response);
	}

	// 장바구니에서 상품 삭제
	@DeleteMapping("/bucket/{bucketNo}/remove")
	public ResponseEntity<Map<String, Object>> removeProductFromBucket(@PathVariable Integer bucketNo) {
		Map<String, Object> response = bucketDAO.removeProductFromBucket(bucketNo);
		return ResponseEntity.ok(response);
	}
	
	 // 특정 사용자의 장바구니 목록 조회
    @GetMapping("/bucket/list")
    public ResponseEntity<List<Map<String, Object>>> getBucketListByUser(HttpSession session) {
        Users user = (Users) session.getAttribute("loginMember");
        if (user == null) {
            return ResponseEntity.status(401).body(null);
        }
        List<Map<String, Object>> response = bucketDAO.getBucketListByUser(user);
        return ResponseEntity.ok(response);
    }
    
    // 장바구니 수량 업데이트
    @PutMapping("/bucket/{bucketNo}/update")
    public ResponseEntity<Map<String, Object>> updateBucketCount(@PathVariable Integer bucketNo,
                                                                 @RequestParam Integer newCount) {
        Map<String, Object> response = bucketDAO.updateBucketCount(bucketNo, newCount);
        return ResponseEntity.ok(response);
    }
}