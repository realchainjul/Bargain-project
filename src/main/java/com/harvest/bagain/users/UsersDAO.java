package com.harvest.bagain.users;

import java.io.File;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.harvest.bagain.BagainFileNameGenerator;

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

    public String registerUser(UserRegisterRequest urr) {
        String fileName = null;
        try {
            // 프로필 사진 저장
            if (urr.getPhoto() != null && !urr.getPhoto().isEmpty()) {
                fileName = BagainFileNameGenerator.generate(urr.getPhoto());
                urr.getPhoto().transferTo(new File(usersImagesDirectory + "/" + fileName));
            }

            // 비밀번호 암호화
            urr.setPassword(bcpe.encode(urr.getPassword()));

            // 주소 포맷팅
            String addr = String.join("!", urr.getAddr1(), urr.getAddr2(), urr.getAddr3());
            urr.setAddr(addr);

            Users user = new Users();
            user.setEmail(urr.getEmail());
            user.setPassword(urr.getPassword());
            user.setName(urr.getName());
            user.setNickname(urr.getNickname());
            user.setPhoneNumber(urr.getPhoneNumber());
            user.setAddress(urr.getAddr());
            user.setPhoto(fileName);

            usersRepo.save(user);

            return "가입 성공";

        } catch (Exception e) {
            if (fileName != null) {
                new File(usersImagesDirectory + "/" + fileName).delete();
            }
            return "가입 실패";
        }
    }
}
