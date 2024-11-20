package com.harvest.bagain.liked;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.harvest.bagain.users.Users;

import jakarta.servlet.http.HttpSession;

@RestController
public class LikedController {

    @Autowired
    private LikedDAO lDAO;

 // 찜한 상품 목록 조회
    @GetMapping("/mypage/userpage/like")
    public ResponseEntity<List<Map<String, Object>>> getLikedProducts(HttpSession session) {
        Users user = (Users) session.getAttribute("loginMember");
        if (user == null) {
            return ResponseEntity.status(401).body(null); // 401 Unauthorized 처리
        }
        Integer userCode = user.getCode();
        List<Map<String, Object>> likedProducts = lDAO.getLikedProductsByUser(userCode);
        return ResponseEntity.ok(likedProducts);
    }
}
