package com.harvest.bagain.products;

import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.harvest.bagain.liked.LikedRepository;
import com.harvest.bagain.users.Users;

import jakarta.servlet.http.HttpSession;

@RestController
public class ProductsController {

	private static final Logger logger = LoggerFactory.getLogger(ProductsController.class);
	@Autowired
	private ProductsDAO pDAO;
	
	@Autowired
    private LikedRepository likedRepo;
	
	// 상품 등록
	@PostMapping("/mypage/userpage/productadd")
    public ResponseEntity<Map<String, Object>> addProduct(@Validated @ModelAttribute ProductsAddReq req,
            @RequestParam(required = false) MultipartFile photo,
            @RequestParam(required = false) MultipartFile[] commentphoto, HttpSession session) {

        String userEmail = (String) session.getAttribute("userEmail");
        Optional<Users> userOpt = pDAO.getUserByEmail(userEmail);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("status", false, "message", "유효하지 않은 사용자 코드"));
        }
        Map<String, Object> result = pDAO.addProduct(req, photo, commentphoto, userOpt.get());
        return ResponseEntity.ok(result);
    }
	
	@GetMapping("/mypage/userpage/products")
    public ResponseEntity<Map<String, Object>> getMyProducts(HttpSession session) {
        Users loginMember = (Users) session.getAttribute("loginMember");
        if (loginMember == null) {
            return ResponseEntity.status(401).body(Map.of("status", false, "message", "로그인이 필요합니다."));
        }
        Map<String, Object> response = pDAO.getProductsBySeller(loginMember);
        return ResponseEntity.ok(response);
    }
	
	@GetMapping("/mypage/userpage/products/delete")
    public ResponseEntity<Map<String, Object>> deleteMyProduct(@RequestParam Integer productCode, HttpSession session) {
        Users user = (Users) session.getAttribute("loginMember");
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("status", false, "message", "로그인이 필요합니다."));
        }
        Map<String, Object> response = pDAO.deleteProductBySeller(user, productCode);
        return ResponseEntity.ok(response);
    }
	
	// 찜하기
	@GetMapping("/products/{productCode}/liked")
    public ResponseEntity<Map<String, Object>> toggleLikeProduct(@PathVariable Integer productCode, HttpSession session) {
        Users user = (Users) session.getAttribute("loginMember");
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("status", false, "message", "로그인이 필요합니다."));
        }
        Map<String, Object> response = pDAO.toggleLikeProduct(user, productCode);
        response.put("likedStatus", response.get("message").equals("찜 목록에 추가되었습니다."));
        return ResponseEntity.ok(response);
    }
}
