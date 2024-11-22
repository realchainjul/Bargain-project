package com.harvest.bagain.bills;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.harvest.bagain.users.Users;

import jakarta.servlet.http.HttpSession;

@RestController
public class BillsController {

    @Autowired
    private BillsDAO billsDAO;

    @PostMapping("/bill/add")
    public ResponseEntity<Map<String, Object>> addBill(HttpSession session) {
        Users user = (Users) session.getAttribute("loginMember");

        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("status", false, "message", "로그인이 필요합니다."));
        }

        try {
            Map<String, Object> response = billsDAO.addBill(user);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("status", false, "message", "서버 오류가 발생했습니다: " + e.getMessage()));
        }
    }
}