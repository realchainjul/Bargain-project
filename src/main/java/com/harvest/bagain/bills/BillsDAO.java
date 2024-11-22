package com.harvest.bagain.bills;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.harvest.bagain.bucket.Bucket;
import com.harvest.bagain.bucket.BucketRepository;
import com.harvest.bagain.products.Products;
import com.harvest.bagain.users.Users;
import com.harvest.bagain.users.UsersDAO;

@Service
public class BillsDAO {

	@Autowired
	private BillsRepository billsRepo;

	@Autowired
	private BucketRepository bucketRepo;

	@Autowired
	private UsersDAO usersDAO;

	public Map<String, Object> addBill(Users user) {
		Map<String, Object> response = new HashMap<>();

		List<Bucket> bucketList = bucketRepo.findAllByUser(user);
		if (bucketList.isEmpty()) {
			response.put("status", false);
			response.put("message", "장바구니에 상품이 없습니다.");
			return response;
		}

		List<Map<String, Object>> billDetails = new ArrayList<>();
		Map<String, String> addressMap = usersDAO.splitAddress(user);

		for (Bucket bucket : bucketList) {
			Products product = bucket.getProduct();
			Bills bill = new Bills();
			bill.setUser(user);
			bill.setProduct(product);
			bill.setAddress(addressMap.get("address")); // 사용자 기본 주소로 설정
			bill.setCount(bucket.getBucketCount());
			bill.setPrice(product.getPrice());
			bill.setTotalPrice(product.getPrice() * bucket.getBucketCount()); // 총 가격 계산 후 설정

			billsRepo.save(bill);

			Map<String, Object> billInfo = new HashMap<>();
			billInfo.put("billCode", bill.getCode());
			billInfo.put("productCode", product.getPcode());
			billInfo.put("productName", product.getName());
			billInfo.put("price", product.getPrice());
			billInfo.put("count", bucket.getBucketCount());
			billInfo.put("totalPrice", bill.getTotalPrice());
			billDetails.add(billInfo);
		}

		response.put("status", true);
		response.put("message", "결제가 성공적으로 추가되었습니다.");
		response.put("userAddress", addressMap);
		response.put("bills", billDetails);

		return response;
	}

	public Map<String, Object> updateBills(List<PaymentDetails> paymentDetailsList, Users user, String postalCode,
			String address, String detailAddress) {
		Map<String, Object> response = new HashMap<>();
		try {
			String fullAddress = postalCode + "!" + address + "!" + detailAddress;
			for (PaymentDetails paymentDetails : paymentDetailsList) {
				Optional<Bills> billOpt = billsRepo.findById(paymentDetails.getBillCode());
				if (billOpt.isPresent() && billOpt.get().getUser().getCode().equals(user.getCode())) {
					Bills bill = billOpt.get();
					String paymentMethod = paymentDetails.getPaymentMethod();
					Integer count = paymentDetails.getCount();
					Integer totalPrice = paymentDetails.getTotalPrice();

					bill.setPayment(paymentMethod);
					bill.setAddress(fullAddress);
					bill.setTotalPrice(totalPrice);
					bill.setCount(count);
					billsRepo.save(bill);
				} else {
					if (!billOpt.isPresent()) {

					} else {

					}
					response.put("status", false);
					response.put("message", "유효하지 않은 결제 정보이거나 권한이 없습니다.");
					return response;
				}
			}
			response.put("status", true);
			response.put("message", "결제가 성공적으로 업데이트되었습니다.");
		} catch (Exception e) {
			response.put("status", false);
			response.put("message", "결제 업데이트 중 오류가 발생했습니다.");
		}

		return response;
	}
}
