package com.harvest.bagain.users;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/users")
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

    // 사용자 등록
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Validated @ModelAttribute UserRegisterRequest urr) {
        String result = usersDAO.registerUser(urr);
        return ResponseEntity.ok(result);
    }
}
