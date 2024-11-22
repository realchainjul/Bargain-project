package com.harvest.bagain.bills;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.harvest.bagain.users.Users;

import jakarta.servlet.http.HttpSession;

@RestController
public class BillsController {

    @Autowired
    private BillsDAO billsDAO;

    @PostMapping("/bills/add")
    public ResponseEntity<Map<String, Object>> addBill(HttpSession session) {
        Users user = (Users) session.getAttribute("loginMember");

        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("status", false, "message", "로그인이 필요합니다."));
        }

        Map<String, Object> response = billsDAO.addBill(user);
        return ResponseEntity.ok(response);
    }
    @PutMapping("/bills/update")
    public ResponseEntity<Map<String, Object>> updateBills(@RequestBody List<PaymentDetails> paymentDetailsList,
                                                           @RequestParam String postalCode,
                                                           @RequestParam String address,
                                                           @RequestParam String detailAddress,
                                                           HttpSession session) {
        Users user = (Users) session.getAttribute("loginMember");

        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("status", false, "message", "로그인이 필요합니다."));
        }

        Map<String, Object> response = billsDAO.updateBills(paymentDetailsList, user, postalCode, address, detailAddress);
        return ResponseEntity.ok(response);
    }
}