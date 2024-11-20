package com.harvest.bagain.liked;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.harvest.bagain.products.Products;
import com.harvest.bagain.products.ProductsRepository;
import com.harvest.bagain.users.Users;

import jakarta.transaction.Transactional;

@Service
public class LikedDAO {

    @Autowired
    private LikedRepository likedRepo;

    @Autowired
    private ProductsRepository prodRepo;

    // 찜하기 삭제
    @Transactional
    public Map<String, Object> deleteLikeProduct(Users user, Products product) {
        Optional<Liked> optionalLiked = likedRepo.findByUserAndProduct(user, product);
        if (optionalLiked.isPresent()) {
            // 찜하기 삭제
            likedRepo.delete(optionalLiked.get());
            product.setLikesCount(Math.max(Optional.ofNullable(product.getLikesCount()).orElse(0) - 1, 0));
            return Map.of("status", true, "message", "찜하기가 삭제되었습니다.");
        } else {
            return Map.of("status", false, "message", "찜하기가 존재하지 않습니다.");
        }
    }

 // 특정 사용자의 찜한 상품 목록 조회
    public List<Map<String, Object>> getLikedProductsByUser(Integer userCode) {
        List<Liked> likedList = likedRepo.findAllByUserCodeAndLikedStatusTrue(userCode);
        List<Map<String, Object>> responseList = new ArrayList<>();

        for (Liked liked : likedList) {
            Products product = liked.getProduct();

            Map<String, Object> productInfo = new HashMap<>();
            productInfo.put("productCode", product.getPcode());
            productInfo.put("productName", product.getName());
            productInfo.put("price", product.getPrice());
            productInfo.put("inventory", product.getInventory());
            productInfo.put("photoUrl", product.getPhoto() != null
                    ? "https://file.bargainus.kr/products/images/" + product.getPhoto()
                    : "");
            productInfo.put("categoryName", product.getCategory().getName());
            responseList.add(productInfo);
        }

        return responseList;
    }
}
