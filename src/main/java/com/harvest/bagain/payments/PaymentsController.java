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


        Map<String, Object> response = paymentsDAO.createPayment(request);
        if ((boolean) response.get("status")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(400).body(response);
        }
    }

    @PutMapping("/status/update")
    public ResponseEntity<Map<String, Object>> updatePaymentStatus(@RequestParam Integer paymentId,
                                                                   @RequestParam String status,
                                                                   @RequestParam(required = false) String errorMessage) {
        Map<String, Object> response = paymentsDAO.updatePaymentStatus(paymentId, status, errorMessage);
        if ((boolean) response.get("status")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(400).body(response);
        }
    }
}
