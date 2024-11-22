package com.harvest.bagain.bills;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.harvest.bagain.bucket.Bucket;
import com.harvest.bagain.bucket.BucketRepository;
import com.harvest.bagain.products.Products;
import com.harvest.bagain.users.Users;

@Service
public class BillsDAO {

    @Autowired
    private BillsRepository billsRepo;

    @Autowired
    private BucketRepository bucketRepo;

    public Map<String, Object> addBill(Users user) {
        Map<String, Object> response = new HashMap<>();

        List<Bucket> bucketList = bucketRepo.findAllByUser(user);
        if (bucketList.isEmpty()) {
            response.put("status", false);
            response.put("message", "장바구니에 상품이 없습니다.");
            return response;
        }

        try {
            for (Bucket bucket : bucketList) {
                Products product = bucket.getProduct();
                Bills bill = new Bills();
                bill.setUser(user);
                bill.setProduct(product);
                bill.setAddress(user.getAddress()); // 사용자 기본 주소로 설정
                bill.setCount(bucket.getBucketCount());
                bill.setPrice(product.getPrice());
                bill.setTotalPrice(product.getPrice() * bucket.getBucketCount()); // 총 가격 계산 후 설정

                billsRepo.save(bill);
            }

            response.put("status", true);
            response.put("message", "결제가 성공적으로 추가되었습니다.");
        } catch (Exception e) {
            response.put("status", false);
            response.put("message", "결제 추가 중 오류가 발생했습니다: " + e.getMessage());
        }

        return response;
    }
}