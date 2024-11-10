package com.harvest.bagain.users;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class UsersController {

    @Autowired
    private UsersDAO usersDAO;

    // 이메일 중복 확인
    @GetMapping("/check-email")
    public ResponseEntity<String> checkEmailDuplicate(@RequestParam String email) {
        String result = usersDAO.checkEmailDuplicate(email);
        return ResponseEntity.ok(result);
    }

    // 닉네임 중복 확인
    @GetMapping("/check-nickname")
    public ResponseEntity<String> checkNicknameDuplicate(@RequestParam String nickname) {
        String result = usersDAO.checkNicknameDuplicate(nickname);
        return ResponseEntity.ok(result);
    }

    // 사용자 등록 (회원가입)
    @PostMapping("/join")
    public ResponseEntity<String> join(
        @Validated @ModelAttribute UserJoinReq req,
        @RequestParam(required = false) MultipartFile photo) {
        String result = usersDAO.join(req, photo);
        return ResponseEntity.ok(result);
    }
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestParam String email, @RequestParam String password, HttpServletRequest req) {
        Map<String, Object> result = usersDAO.login(email, password, req);
        return ResponseEntity.ok(result);
    }
}
