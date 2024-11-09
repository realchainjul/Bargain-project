import { InfoList } from '../../components/Signup/infoList';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom/dist';
import Button from '../../components/common/Button';
import style from './Signup.module.scss';
import axios from 'axios';

const MAX_PROFILE_IMAGE_SIZE = 1024 * 1024;

export default function Signup() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    email: '',
    pw: '',
    name: '',
    nickName: '',
    phoneNumber: '',
    postalCode: '', // 우편번호
    address: '', // 기본 주소
    detailAddress: '', // 상세 주소
    checkPassword: '' // 비밀번호 확인 추가
  });

  const [profileImg, setProfileImg] = useState(null);
  const [isConfirmEmail, setIsConfirmEmail] = useState(true);
  const [isConfirmPassword, setIsConfirmPassword] = useState(false);
  const [isConfirmCheckPassword, setIsConfirmCheckPassword] = useState(false);

  const { email, pw, name, nickname, phoneNumber, postalCode, address, detailAddress, checkPassword } = inputs;

  const handleChangeInfoInputs = (event) => {
    const { value, name } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));

    // 비밀번호 유효성 및 비밀번호 확인 유효성 확인 업데이트
    if (name === 'pw') {
      setIsConfirmPassword(value.length >= 8); // 비밀번호 8자 이상 확인
      setIsConfirmCheckPassword(value === inputs.checkPassword); // 비밀번호 확인 일치 여부 확인
    } else if (name === 'checkPassword') {
      setIsConfirmCheckPassword(inputs.pw === value); // 비밀번호와 확인값 일치 여부
    }
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setInputs((prevInputs) => ({
          ...prevInputs,
          postalCode: data.zonecode, // 우편번호 저장
          address: data.address, // 기본 주소 저장
        }));
      },
    }).open();
  };

  const handleChangeProfileImg = (event) => {
    if (event.target.files) {
      const file = event.target.files[0];

      if (!isCheckProfileSize(file.size)) return;

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        setProfileImg(reader.result);
      };
    }
  };

  const isCheckProfileSize = (size) => {
    if (size > MAX_PROFILE_IMAGE_SIZE) {
      alert('이미지 사이즈는 최대 1MB입니다.');
      return false;
    }
    return true;
  };

  const handleSubmitSignup = async (event) => {
    event.preventDefault();
  
    // 유효성 검사
    if (!(isConfirmEmail && isConfirmPassword && isConfirmCheckPassword)) {
      alert('필수 사항을 조건에 맞게 모두 입력해주세요.');
      return;
    }
  
    // 이메일 중복 확인
    const emailCheckResponse = await fetch(`https://api.bargainus.kr/check-email?email=${inputs.email}`, {
      method: "GET",
    });
    const emailCheckResult = await emailCheckResponse.text();
    if (emailCheckResult === "중복된 이메일입니다.") {
      alert(emailCheckResult);
      return; // 중복된 이메일이면 회원가입 진행하지 않음
    }
  
    // 닉네임 중복 확인
    const nicknameCheckResponse = await fetch(`https://api.bargainus.kr/check-nickname?nickname=${inputs.nickname}`, {
      method: "GET",
    });
    const nicknameCheckResult = await nicknameCheckResponse.text();
    if (nicknameCheckResult === "중복된 닉네임입니다.") {
      alert(nicknameCheckResult);
      return; // 중복된 닉네임이면 회원가입 진행하지 않음
    }
  
    // FormData 생성
    const formData = new FormData();
    formData.append("email", inputs.email);
    formData.append("password", inputs.pw);
    formData.append("name", inputs.name);
    formData.append("nickname", inputs.nickname);
    formData.append("phoneNumber", inputs.phonNumber);
    formData.append("postalCode", inputs.postalCode);
    formData.append("address", inputs.address);
    formData.append("detailAddress", inputs.detailAddress);
  
    if (profileImg) {
      formData.append("photo", profileImg);
    }
  
    // 회원가입 요청 보내기
    try {
      const response = await fetch("https://api.bargainus.kr/join", { // 서버 주소를 명확히 입력
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
      if (result.status === "success") {
        alert(result.message); // 성공 메시지 표시
        navigate("/login"); // 성공 시 로그인 페이지로 이동
      } else {
        alert(result.message); // 실패 메시지 표시
      }
    } catch (error) {
      console.error("Error:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };
  
  return (
    <div className={style.signup}>
      <div className={style.header}>
        <h1>회원가입</h1>
      </div>
      <form id="signup" onSubmit={handleSubmitSignup}>
        <InfoList
          label={'이메일'}
          input={{
            name: 'email',
            value: email,
            required: true,
            onChange: handleChangeInfoInputs,
            placeholder: '이메일을 입력해 주세요',
          }}
          button={{
            name: '중복 확인',
            onClick: (e) => {
              e.preventDefault();
            },
          }}
        />
        <InfoList
          label={'비밀번호'}
          input={{
            name: 'pw',
            value: pw,
            type: 'password',
            required: true,
            onChange: handleChangeInfoInputs,
            placeholder: '비밀번호를 입력해 주세요',
            checkInput: {
              isConfirm: isConfirmPassword,
              errorMessage: '비밀번호는 8자 이상이어야 합니다.',
            },
          }}
        />
        <InfoList
          label={'비밀번호 확인'}
          input={{
            name: 'checkPassword',
            value: checkPassword,
            type: 'password',
            required: true,
            onChange: handleChangeInfoInputs,
            placeholder: '비밀번호를 다시 입력해 주세요',
            checkInput: {
              isConfirm: isConfirmCheckPassword,
              errorMessage: ' 비밀번호가 일치하지 않습니다.',
            },
          }}
        />
        <InfoList
          label={'이름'}
          input={{
            name: 'name',
            value: name,
            required: true,
            onChange: handleChangeInfoInputs,
            placeholder: '이름을 입력해 주세요',
          }}
        />
        <InfoList
          label={'닉네임'}
          input={{
            name: 'nickname',
            value: nickname,
            required: true,
            onChange: handleChangeInfoInputs,
            placeholder: '닉네임을 입력해 주세요',
          }}
          button={{
            name: '중복 확인',
            onClick: (e) => {
              e.preventDefault();
            },
          }}
        />
        <InfoList
          label={'전화번호'}
          input={{
            name: 'phoneNumber',
            value: phoneNumber,
            required: true,
            onChange: handleChangeInfoInputs,
            placeholder: '전화번호를 입력해 주세요',
          }}
        />

        {/* 주소 검색 필드 */}
        <InfoList
          label={'우편번호'}
          input={{
            name: 'postalCode',
            value: postalCode,
            required: true,
            readOnly: true,
            placeholder: '우편번호를 입력해 주세요',
          }}
          button={{
            name: '주소 검색',
            onClick: (e) => {
              e.preventDefault();
              handleAddressSearch();
            },
          }}
        />
        <InfoList
          label={'주소'}
          input={{
            name: 'address',
            value: address,
            required: true,
            readOnly: true,
            placeholder: '기본 주소를 입력해 주세요',
          }}
        />
        <InfoList
          label={'상세주소'}
          input={{
            name: 'detailAddress',
            value: detailAddress,
            onChange: handleChangeInfoInputs,
            placeholder: '상세 주소를 입력해 주세요',
          }}
        />

        <section className={style.profile}>
          <label>프로필</label>
          <article className={style.profile_inputContainer}>
            <input
              type="file"
              accept=".jpg, .jpeg, .webp, .png, .gif, .svg"
              onChange={handleChangeProfileImg}
            />
            <figure className={style.profile_inputContainer_img}>
              {profileImg && <img alt="프로필" width={150} height={150} src={profileImg} />}
            </figure>
          </article>
        </section>
        <section className={style.btn}>
          <Button name="가입하기" form="signup" type="submit" isPurple={true} width="100%" />
        </section>
      </form>
    </div>
  );
}
