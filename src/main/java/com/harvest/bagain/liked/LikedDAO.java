package com.harvest.bagain.liked;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.harvest.bagain.products.Products;
import com.harvest.bagain.products.ProductsRepository;

@Service
public class LikedDAO {

    @Autowired
    private LikedRepository likedRepo;

    @Autowired
    private ProductsRepository prodRepo;

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
            responseList.add(productInfo);
        }

        return responseList;
    }
}
