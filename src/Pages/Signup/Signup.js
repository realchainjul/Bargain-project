import { InfoList } from '../../components/Signup/infoList';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom/dist';
import Button from '../../components/common/Button';
import style from './Signup.module.scss';

const MAX_PROFILE_IMAGE_SIZE = 1024 * 1024;

export default function Signup() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    email: '',
    pw: '',
    name: '',
    nickName: '',
    phonNum: '',
    postalCode: '', // 우편번호
    address: '', // 기본 주소
    detailAddress: '', // 상세 주소
  });

  const [checkPassword, setCheckPassword] = useState('');
  const [profileImg, setProfileImg] = useState(null);
  const [isConfirmEmail, setIsConfirmEmail] = useState(true);
  const [isConfirmPassword, setIsConfirmPassword] = useState(false);
  const [isConfirmCheckPassword, setIsConfirmCheckPassword] = useState(false);

  const { email, pw, name, nickName, phonNum, postalCode, address, detailAddress } = inputs;

  const handleChangeInfoInputs = (event) => {
    const { value, name } = event.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
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

  const handleChangeCheckPassword = (event) => {
    setCheckPassword(event.currentTarget.value);
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

  const handleConfirmEmail = useCallback(() => {
    if (email.length > 0) setIsConfirmEmail(true);
    else setIsConfirmEmail(false);
  }, [email]);

  const handleConfirmPassword = useCallback(() => {
    if (pw.length >= 8 || pw.length === 0) setIsConfirmPassword(true);
    else setIsConfirmPassword(false);
  }, [pw]);

  const handleConfirmCheckPassword = useCallback(() => {
    if (pw === checkPassword || checkPassword.length === 0) setIsConfirmCheckPassword(true);
    else setIsConfirmCheckPassword(false);
  }, [pw, checkPassword]);

  const handleSubmitSignup = async (event) => {
    event.preventDefault();

    if (!(isConfirmEmail && isConfirmPassword && isConfirmCheckPassword)) {
      alert('필수 사항을 조건에 맞게 모두 입력해주세요.');
      return;
    }

    const signData = {
      email: event.target.email.value,
      password: event.target.password.value,
      displayName: event.target.displayName.value,
      profileImgBase64: profileImg ?? undefined,
      postalCode,
      address,
      detailAddress, // 상세 주소 포함
    };
  };

  useEffect(() => {
    handleConfirmEmail();
  }, [handleConfirmEmail]);

  useEffect(() => {
    handleConfirmPassword();
  }, [handleConfirmPassword]);

  useEffect(() => {
    handleConfirmCheckPassword();
  }, [handleConfirmCheckPassword]);

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
            onChange: handleChangeCheckPassword,
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
            name: 'nickName',
            value: nickName,
            required: true,
            onChange: handleChangeInfoInputs,
            placeholder: '닉네임을 입력해 주세요',
          }}
        />
        <InfoList
          label={'전화번호'}
          input={{
            name: 'phonNum',
            value: phonNum,
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
