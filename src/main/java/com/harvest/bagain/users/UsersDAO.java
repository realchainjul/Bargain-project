package com.harvest.bagain.users;

import java.io.File;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.harvest.bagain.BagainFileNameGenerator;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class UsersDAO {

    private BCryptPasswordEncoder bcpe;

    @Autowired
    private UsersRepository usersRepo;

    @Value("${users.images.directory}")
    private String usersImagesDirectory;

    public UsersDAO() {
        this.bcpe = new BCryptPasswordEncoder();
    }

    public String checkEmailDuplicate(String email) {
        return usersRepo.existsByEmail(email) ? "중복된 이메일입니다." : "사용 가능한 이메일입니다.";
    }

    public String checkNicknameDuplicate(String nickname) {
        return usersRepo.existsByNickname(nickname) ? "중복된 닉네임입니다." : "사용 가능한 닉네임입니다.";
    }

    public String join(UserJoinReq req, MultipartFile photo) {
        String fileName = null;
        try {
            // 프로필 사진 저장
            if (photo != null && !photo.isEmpty()) {
                fileName = BagainFileNameGenerator.generate(photo);
                photo.transferTo(new File(usersImagesDirectory + "/" + fileName));
                req.setPhotoFilename(fileName); // DTO에 파일명만 저장
            }

            // 비밀번호 암호화
            req.setPassword(bcpe.encode(req.getPassword()));

            Users user = new Users();
            user.setEmail(req.getEmail());
            user.setPassword(req.getPassword());
            user.setName(req.getName());
            user.setNickname(req.getNickname());
            user.setPhoneNumber(req.getPhoneNumber());
            user.setAddress(req.getPostalCode() + "!" + req.getAddress() + "!" + req.getDetailAddress());
            user.setPhoto(fileName);

            usersRepo.save(user);

            return "가입 성공";

        } catch (Exception e) {
        	e.printStackTrace();
            if (fileName != null) {
                new File(usersImagesDirectory + "/" + fileName).delete();
            }
            return "가입 실패";
        }
    }
    // 로그인
    public Map<String, Object> login(String email, String password, HttpServletRequest req) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<Users> userOptional = usersRepo.findByEmail(email);
            if (userOptional.isPresent()) {
                Users user = userOptional.get();
                if (bcpe.matches(password, user.getPassword())) {
                    req.getSession().setAttribute("loginUser", user);
                    req.getSession().setMaxInactiveInterval(10 * 60); // 세션 유효 시간 설정 (10분)
                    response.put("status", true);
                    response.put("message", "로그인 성공");
                } else {
                    response.put("status", false);
                    response.put("message", "로그인 실패: 비밀번호 오류");
                }
            } else {
                response.put("status", false);
                response.put("message", "로그인 실패: 가입되지 않은 이메일");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.put("status", false);
            response.put("message", "로그인 실패: 서버 오류");
        }
        return response;
    }
}
