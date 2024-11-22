package com.harvest.bagain.bills;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.harvest.bagain.users.Users;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/bills")
public class BillsController {

    @Autowired
    private BillsDAO billsDAO;

    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addBill(
            @RequestBody Map<String, List<Integer>> selectedBucketIdsMap,
            HttpSession session) {

        // 로그인된 사용자 확인
        Users user = (Users) session.getAttribute("loginMember");
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("status", false, "message", "로그인이 필요합니다."));
        }

        // 선택된 bucket ID 리스트 추출
        List<Integer> selectedBucketIds = selectedBucketIdsMap.get("selectedBucketIds");
        if (selectedBucketIds == null || selectedBucketIds.isEmpty()) {
            return ResponseEntity.status(400).body(Map.of("status", false, "message", "선택된 장바구니 항목이 없습니다."));
        }

        // 선택된 bucket 목록을 DAO로 전달
        Map<String, Object> response = billsDAO.addBill(user, selectedBucketIds);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update")
    public ResponseEntity<Map<String, Object>> updateBills(@RequestBody List<PaymentDetails> paymentDetailsList,
                                                           @RequestParam String postalCode, @RequestParam String address, @RequestParam String detailAddress,
                                                           HttpSession session) {
        Users user = (Users) session.getAttribute("loginMember");

        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("status", false, "message", "로그인이 필요합니다."));
        }

        Map<String, Object> response = billsDAO.updateBills(paymentDetailsList, user, postalCode, address, detailAddress);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/status/update")
    public ResponseEntity<Map<String, Object>> updateBillStatus(
            @RequestParam Integer billCode, @RequestParam String status,
            HttpSession session) {
        Users user = (Users) session.getAttribute("loginMember");

        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("status", false, "message", "로그인이 필요합니다."));
        }

        billsDAO.updateBillStatus(billCode, status);
        return ResponseEntity.ok(Map.of("status", true, "message", "주문 상태가 업데이트되었습니다."));
    }
}
