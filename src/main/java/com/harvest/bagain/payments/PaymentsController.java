package com.harvest.bagain.payments;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/payments")
public class PaymentsController {

    @Autowired
    private PaymentsDAO paymentsDAO;

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createPayment(@RequestBody Map<String, Object> request) {
        if (!request.containsKey("amount") || request.get("amount") == null) {
            return ResponseEntity.status(400).body(Map.of("status", false, "message", "amount 값이 필요합니다."));
        }
        if (!request.containsKey("billCodes") || request.get("billCodes") == null) {
            return ResponseEntity.status(400).body(Map.of("status", false, "message", "billCodes 값이 필요합니다."));
        }
        if (!request.containsKey("impUid") || request.get("impUid") == null) {
            return ResponseEntity.status(400).body(Map.of("status", false, "message", "impUid 값이 필요합니다."));
        }

        // impUid는 프론트엔드에서 전달된 값을 그대로 사용
        Map<String, Object> response = paymentsDAO.createPayment(request);
        if ((boolean) response.get("status")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(400).body(response);
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<Map<String, Object>> handlePaymentWebhook(@RequestBody Map<String, Object> webhookData) {
    	if (!webhookData.containsKey("imp_uid") || webhookData.get("imp_uid") == null) {
            return ResponseEntity.status(400).body(Map.of("status", false, "message", "imp_uid 값이 필요합니다."));
        }
        if (!webhookData.containsKey("status") || webhookData.get("status") == null) {
            return ResponseEntity.status(400).body(Map.of("status", false, "message", "status 값이 필요합니다."));
        }
    	
    	try {
            String impUid = (String) webhookData.get("imp_uid");
            String status = (String) webhookData.get("status");
            String errorMessage = (String) webhookData.getOrDefault("fail_reason", "");

            Integer paymentId = paymentsDAO.findPaymentIdByImpUid(impUid);
            if (paymentId != null) {
                Map<String, Object> response = paymentsDAO.updatePaymentStatus(paymentId, status, errorMessage);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(404).body(Map.of("status", false, "message", "Payment not found for imp_uid: " + impUid));
            }
        } catch (Exception e) {
            e.printStackTrace();  // 서버 로그에 예외를 기록
            return ResponseEntity.status(500).body(Map.of("status", false, "message", "Internal Server Error: " + e.getMessage()));
        }
    }


}
