package com.harvest.bagain.users;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRegisterRequest {

    @NotNull(message = "이메일은 필수 입력 항목입니다.")
    @Email(message = "유효하지 않은 이메일 형식입니다.")
    private String email;

    @NotNull(message = "비밀번호는 필수 입력 항목입니다.")
    @Size(min = 6, message = "비밀번호는 최소 6자 이상이어야 합니다.")
    private String password;

    @NotNull(message = "이름은 필수 입력 항목입니다.")
    private String name;

    @NotNull(message = "닉네임은 필수 입력 항목입니다.")
    @Size(min = 3, max = 12, message = "닉네임은 3자에서 12자 사이여야 합니다.")
    private String nickname;

    @NotNull(message = "전화번호는 필수 입력 항목입니다.")
    private String phoneNumber;

    private String addr1;
    private String addr2;
    private String addr3;
    
    private String addr;
    private MultipartFile photo;
}
