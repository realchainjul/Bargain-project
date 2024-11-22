package com.harvest.bagain.bucket;

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
import com.harvest.bagain.users.UsersRepository;

@Service
public class BucketDAO {

	@Autowired
	private BucketRepository bucketRepo;

	@Autowired
	private UsersRepository userRepo;

	@Autowired
	private ProductsRepository productRepo;

	// 장바구니에 상품 추가
	public Map<String, Object> addProductToBucket(Users user, Products product, Integer count) {
		Map<String, Object> response = new HashMap<>();

		try {
			// 동일한 상품이 장바구니에 있는지 확인
			Optional<Bucket> existingBucketOpt = bucketRepo.findByUserAndProduct(user, product);
			if (existingBucketOpt.isPresent()) {
				// 이미 존재하면 수량 업데이트
				Bucket existingBucket = existingBucketOpt.get();
				existingBucket.setBucketCount(existingBucket.getBucketCount() + count);
				bucketRepo.save(existingBucket);
				response.put("status", true);
				response.put("message", "장바구니에 상품 수량이 업데이트되었습니다.");
			} else {
				// 없으면 새로 추가
				Bucket bucket = new Bucket();
				bucket.setUser(user);
				bucket.setProduct(product);
				bucket.setBucketCount(count);
				bucketRepo.save(bucket);

				response.put("status", true);
				response.put("message", "장바구니에 상품이 추가되었습니다.");
			}
		} catch (Exception e) {
			response.put("status", false);
			response.put("message", "장바구니에 상품 추가 실패");
		}

		return response;
	}
	// 특정 사용자의 장바구니 목록 조회
    public List<Map<String, Object>> getBucketListByUser(Users user) {
        List<Bucket> bucketList = bucketRepo.findAllByUser(user);
        List<Map<String, Object>> responseList = new ArrayList<>();

        for (Bucket bucket : bucketList) {
            Products product = bucket.getProduct();

            Map<String, Object> productInfo = new HashMap<>();
            productInfo.put("bucketNo", bucket.getBucketNo());
            productInfo.put("productCode", product.getPcode());
            productInfo.put("productName", product.getName());
            productInfo.put("price", product.getPrice());
            productInfo.put("bucketCount", bucket.getBucketCount());
            productInfo.put("photoUrl", product.getPhoto() != null ? "https://file.bargainus.kr/products/images/" + product.getPhoto() : "");
            responseList.add(productInfo);
        }

        return responseList;
    }

	// 장바구니에서 상품 삭제
	public Map<String, Object> removeProductFromBucket(Integer bucketNo) {
		Map<String, Object> response = new HashMap<>();

		try {
			bucketRepo.deleteById(bucketNo);
			response.put("status", true);
			response.put("message", "장바구니에서 상품이 삭제되었습니다.");
		} catch (Exception e) {
			response.put("status", false);
			response.put("message", "장바구니에서 상품 삭제 실패");
		}

		return response;
	}

	// 장바구니 수량 업데이트
	public Map<String, Object> updateBucketCount(Integer bucketNo, Integer newCount) {
		Map<String, Object> response = new HashMap<>();

		try {
			Optional<Bucket> bucketOpt = bucketRepo.findById(bucketNo);
			if (bucketOpt.isPresent()) {
				Bucket bucket = bucketOpt.get();
				bucket.setBucketCount(newCount);
				bucketRepo.save(bucket);
				response.put("status", true);
				response.put("message", "장바구니 수량이 업데이트되었습니다.");
			} else {
				response.put("status", false);
				response.put("message", "유효하지 않은 장바구니 번호입니다.");
			}
		} catch (Exception e) {
			response.put("status", false);
			response.put("message", "장바구니 수량 업데이트 실패");
		}

		return response;
	}
}
