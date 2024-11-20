package com.harvest.bagain.liked;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.harvest.bagain.products.Products;
import com.harvest.bagain.products.ProductsDAO;
import com.harvest.bagain.users.Users;

import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;

@RestController
public class LikedController {

	@Autowired
	private LikedDAO lDAO;

	@Autowired
	private ProductsDAO pDAO;

	// 찜한 상품 목록 조회
	@GetMapping("/mypage/userpage/liked")
	public ResponseEntity<List<Map<String, Object>>> getLikedProducts(HttpSession session) {
		Users user = (Users) session.getAttribute("loginMember");
		if (user == null) {
			return ResponseEntity.status(401).body(null); // 401 Unauthorized 처리
		}
		Integer userCode = user.getCode();
		List<Map<String, Object>> likedProducts = lDAO.getLikedProductsByUser(userCode);
		return ResponseEntity.ok(likedProducts);
	}

	@GetMapping("/mypage/userpage/liked/{productCode}/delete")
	@Transactional
	public ResponseEntity<Map<String, Object>> deleteLikeProductGet(@PathVariable Integer productCode,
			HttpSession session) {
		String userEmail = (String) session.getAttribute("userEmail");
		Optional<Users> userOpt = pDAO.getUserByEmail(userEmail);
		Optional<Products> productOpt = pDAO.getProductByCode(productCode);

		if (userOpt.isEmpty() || productOpt.isEmpty()) {
			return ResponseEntity.status(404).body(Map.of("status", false, "message", "유효하지 않은 사용자 또는 상품 코드"));
		}

		Map<String, Object> result = lDAO.deleteLikeProduct(userOpt.get(), productOpt.get());
		return ResponseEntity.ok(result);
	}
}
