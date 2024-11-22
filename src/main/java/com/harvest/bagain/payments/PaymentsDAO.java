package com.harvest.bagain.payments;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.harvest.bagain.bills.Bills;
import com.harvest.bagain.bills.BillsRepository;

@Service
public class PaymentsDAO {
	 private static final Logger logger = LoggerFactory.getLogger(PaymentsDAO.class);
	
    @Autowired
    private PaymentsRepository paymentsRepository;

    @Autowired
    private BillsRepository billsRepository;

    @Value("${iamport.api.key}")
    private String apiKey;

    @Value("${iamport.api.secret}")
    private String apiSecret;
    
    private String getIamportToken() {
        String url = "https://api.iamport.kr/users/getToken";
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = new HashMap<>();
        body.put("imp_key", apiKey); // 외부화된 API 키 사용
        body.put("imp_secret", apiSecret); // 외부화된 API 시크릿 사용

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            Map<String, Object> responseBody = (Map<String, Object>) response.getBody().get("response");
            if (responseBody != null) {
                return (String) responseBody.get("access_token");
            }
        } else {
            System.err.println("토큰 요청 중 오류 발생: " + response.getStatusCode() + " - " + response.getBody());
        }
        throw new RuntimeException("토큰 발급 실패");
    }
    
    private Map<String, Object> requestIamportPayment(String token, Payments payment) {
        String url = "https://api.iamport.kr/payments/prepare";
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);

        Map<String, Object> body = new HashMap<>();
        body.put("merchant_uid", payment.getMerchantUid());
        body.put("amount", payment.getAmount());

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            return response.getBody();
        } else {
            System.err.println("결제 준비 중 오류 발생: " + response.getStatusCode() + " - " + response.getBody());
            throw new RuntimeException("결제 준비 중 오류 발생: 상태 코드 - " + response.getStatusCode() + ", 응답 내용 - " + response.getBody());
        }
    }
    
    public Map<String, Object> createPayment(Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();

        try {
            Payments payment = new Payments();
            payment.setAmount(request.get("amount") != null ? Integer.parseInt(request.get("amount").toString()) : 0);
            payment.setPaymentMethod((String) request.get("paymentMethod"));
            payment.setPaymentStatus("PENDING");
            payment.setImpUid((String) request.get("impUid")); // 요청으로부터 impUid 사용
            payment.setMerchantUid("merchant_" + System.currentTimeMillis());

            Payments savedPayment = paymentsRepository.save(payment);

            // billCodes로 해당 청구서들을 결제와 연결
            List<Integer> billCodes = (List<Integer>) request.get("billCodes");
            for (Integer billCode : billCodes) {
                Optional<Bills> billOptional = billsRepository.findById(billCode);
                if (billOptional.isPresent()) {
                    Bills bill = billOptional.get();
                    bill.setPayments(savedPayment);  // `Payments` 객체를 설정
                    billsRepository.save(bill);
                }
            }

            // I'mport 결제 준비 요청
            String token = getIamportToken();
            requestIamportPayment(token, savedPayment);

            response.put("status", true);
            response.put("message", "결제가 성공적으로 생성되었습니다.");
            response.put("paymentId", savedPayment.getPaymentId());
        } catch (Exception e) {
            response.put("status", false);
            response.put("message", "결제 생성 중 오류가 발생했습니다: " + e.getMessage());
        }

        return response;
    }

    public Map<String, Object> updatePaymentStatus(Integer paymentId, String status, String errorMessage) {
        Map<String, Object> response = new HashMap<>();

        Optional<Payments> paymentOptional = paymentsRepository.findById(paymentId);
        if (paymentOptional.isEmpty()) {
            response.put("status", false);
            response.put("message", "결제를 찾을 수 없습니다.");
            return response;
        }

        Payments payment = paymentOptional.get();
        payment.setPaymentStatus(status);
        if (errorMessage != null && !errorMessage.isEmpty()) {
            payment.setErrorMessage(errorMessage);
        }
        paymentsRepository.save(payment);

        response.put("status", true);
        response.put("message", "결제상태가 업데이트 되었습니다.");
        return response;
    }

    public Integer findPaymentIdByImpUid(String impUid) {
        Optional<Payments> paymentOptional = paymentsRepository.findByImpUid(impUid);
        return paymentOptional.map(Payments::getPaymentId).orElse(null);
    }
}