import { InfoList } from '../../components/Signup/infoList';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    nickname: '',
    phoneNumber: '',
    postalCode: '',
    address: '',
    detailAddress: '',
    checkPassword: '',
  });

  const [profileImg, setProfileImg] = useState(null);
  const [isConfirmEmail, setIsConfirmEmail] = useState(false);
  const [isConfirmNickname, setIsConfirmNickname] = useState(false);
  const [isConfirmPassword, setIsConfirmPassword] = useState(false);
  const [isConfirmCheckPassword, setIsConfirmCheckPassword] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [nicknameError, setNicknameError] = useState('');

  const handleChangeInfoInputs = (event) => {
    const { name, value } = event.target;

    if (name === 'email') {
      setIsConfirmEmail(false);
      setEmailError('');
    } else if (name === 'nickname') {
      setIsConfirmNickname(false);
      setNicknameError('');
    }

    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));

    if (name === 'pw') {
      setIsConfirmPassword(value.length >= 8);
      setIsConfirmCheckPassword(value === inputs.checkPassword);
    } else if (name === 'checkPassword') {
      setIsConfirmCheckPassword(inputs.pw === value);
    }
  };

  const handleChangeProfileImg = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!isCheckProfileSize(file.size)) return;
      setProfileImg(file);
    }
  };

  const isCheckProfileSize = (size) => {
    if (size > MAX_PROFILE_IMAGE_SIZE) {
      alert('이미지 사이즈는 최대 1MB입니다.');
      return false;
    }
    return true;
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setInputs((prevInputs) => ({
          ...prevInputs,
          postalCode: data.zonecode,
          address: data.address,
        }));
      },
    }).open();
  };

  const handleCheckEmail = async () => {
    if (!inputs.email) {
      setEmailError('이메일을 입력해주세요.');
      return;
    }

    try {
      const response = await axios.get('https://api.bargainus.kr/check-email', {
        params: { email: inputs.email },
      });

      if (response.data === '사용 가능한 이메일입니다.') {
        setIsConfirmEmail(true);
        setEmailError('사용 가능한 이메일입니다.');
      } else if (response.data === '중복된 이메일입니다.') {
        setIsConfirmEmail(false);
        setEmailError('중복된 이메일입니다.');
      } else {
        setIsConfirmEmail(false);
        setEmailError('이메일 확인 중 오류가 발생했습니다.');
      }
    } catch (error) {
      setIsConfirmEmail(false);
      setEmailError('서버 연결에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleCheckNickname = async () => {
    if (!inputs.nickname) {
      setNicknameError('닉네임을 입력해주세요.');
      return;
    }

    try {
      const response = await axios.get('https://api.bargainus.kr/check-nickname', {
        params: { nickname: inputs.nickname },
      });

      if (response.data === '사용 가능한 닉네임입니다.') {
        setIsConfirmNickname(true);
        setNicknameError('사용 가능한 닉네임입니다.');
      } else if (response.data === '중복된 닉네임입니다.') {
        setIsConfirmNickname(false);
        setNicknameError('중복된 닉네임입니다.');
      } else {
        setIsConfirmNickname(false);
        setNicknameError('닉네임 확인 중 오류가 발생했습니다.');
      }
    } catch (error) {
      setIsConfirmNickname(false);
      setNicknameError('서버 연결에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleSubmitSignup = async (event) => {
    event.preventDefault();

    if (!(isConfirmEmail && isConfirmNickname && isConfirmPassword && isConfirmCheckPassword)) {
      alert('필수 사항을 조건에 맞게 모두 입력해주세요.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('email', inputs.email);
      formData.append('password', inputs.pw);
      formData.append('name', inputs.name);
      formData.append('nickname', inputs.nickname);
      formData.append('phoneNumber', inputs.phoneNumber);
      formData.append('postalCode', inputs.postalCode);
      formData.append('address', inputs.address);
      formData.append('detailAddress', inputs.detailAddress);

      if (profileImg) {
        formData.append('photo', profileImg);
      }

      const response = await axios.post('https://api.bargainus.kr/join', formData);

      if (response.data === '회원가입 성공') {
        alert('회원가입이 완료되었습니다.');
        navigate('/login');
      } else {
        alert(response.data);
      }
    } catch (error) {
      alert('회원가입 중 오류가 발생했습니다.');
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
            value: inputs.email,
            required: true,
            onChange: handleChangeInfoInputs,
            placeholder: '이메일을 입력해 주세요',
          }}
          button={{
            name: '중복 확인',
            onClick: handleCheckEmail,
          }}
        />
        {emailError && <p className={style.error}>{emailError}</p>}

        <InfoList
          label={'닉네임'}
          input={{
            name: 'nickname',
            value: inputs.nickname,
            required: true,
            onChange: handleChangeInfoInputs,
            placeholder: '닉네임을 입력해 주세요',
          }}
          button={{
            name: '중복 확인',
            onClick: handleCheckNickname,
          }}
        />
        {nicknameError && <p className={style.error}>{nicknameError}</p>}

        <InfoList
          label={'이름'}
          input={{
            name: 'name',
            value: inputs.name,
            required: true,
            onChange: handleChangeInfoInputs,
            placeholder: '이름을 입력해 주세요',
          }}
        />

        <InfoList
          label={'전화번호'}
          input={{
            name: 'phoneNumber',
            value: inputs.phoneNumber,
            required: true,
            onChange: handleChangeInfoInputs,
            placeholder: '전화번호를 입력해 주세요',
          }}
        />

        <InfoList
          label={'우편번호'}
          input={{
            name: 'postalCode',
            value: inputs.postalCode,
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
            value: inputs.address,
            required: true,
            readOnly: true,
            placeholder: '기본 주소를 입력해 주세요',
          }}
        />

        <InfoList
          label={'상세주소'}
          input={{
            name: 'detailAddress',
            value: inputs.detailAddress,
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
              {profileImg && <img alt="프로필" width={150} height={150} src={URL.createObjectURL(profileImg)} />}
            </figure>
          </article>
        </section>

        <Button name="가입하기" form="signup" type="submit" isPurple={true} width="100%" />
      </form>
    </div>
  );
}
