import React, { useEffect, useState } from 'react';
import Button from '../../../components/common/Button';
import style from './MyInfo.module.scss';
import axios from 'axios';

const MAX_PROFILE_IMAGE_SIZE = 1024 * 1024;

const MyInfo = () => {
  const [inputs, setInputs] = useState({
    email: '',
    name: '',
    displayName: '',
    phoneNumber: '',
  });
  const [profileImg, setProfileImg] = useState(null);
  const [nicknameError, setNicknameError] = useState('');
  const [isConfirmNickname, setIsConfirmNickname] = useState(false);

  const { email, name, displayName, phoneNumber } = inputs;

  // 사용자 로그인 데이터 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('https://api.bargainus.kr/info', { withCredentials: true });

        if (response.status === 200) {
          const data = response.data;
          setInputs({
            email: data.email,
            name: data.name,
            displayName: data.nickname,
            phoneNumber: data.phoneNumber,
          });
          setProfileImg(data.photoFilename || null);
        } else {
          alert('사용자 정보를 불러오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('사용자 정보를 가져오는 중 오류 발생:', error);
        alert('서버 연결에 실패했습니다.');
      }
    };

    fetchUserInfo();
  }, []);

  // 입력 변경 처리
  const handleChangeInputs = (event) => {
    const { value, name } = event.target;

    if (name === 'displayName') {
      setIsConfirmNickname(false); // 닉네임 변경 시 중복 확인 상태 초기화
      setNicknameError('');
    }

    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  // 닉네임 중복 확인
  const handleCheckNickname = async () => {
    if (!inputs.displayName) {
      setNicknameError('닉네임을 입력해주세요.');
      return;
    }

    try {
      const response = await axios.get('https://api.bargainus.kr/check-nickname', {
        params: { nickname: inputs.displayName },
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

  // 프로필 이미지 변경 처리
  const handleChangeProfileImg = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!isCheckProfileSize(file.size)) return;

      setProfileImg(file);
    }
  };

  // 프로필 이미지 크기 확인
  const isCheckProfileSize = (size) => {
    if (size > MAX_PROFILE_IMAGE_SIZE) {
      alert('이미지 사이즈는 최대 1MB입니다.');
      return false;
    }
    return true;
  };

  // 회원정보 수정 요청 처리
  const handleSubmitUpdate = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('email', email);
    formData.append('name', name);
    formData.append('nickname', displayName);
    formData.append('phoneNumber', phoneNumber);
    if (profileImg) {
      formData.append('photo', profileImg);
    }

    try {
      const response = await axios.post('https://api.bargainus.kr/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      if (response.status === 200 && response.data.status) {
        alert('회원 정보가 성공적으로 수정되었습니다.');
      } else {
        alert('회원 정보 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원 정보 수정 중 오류 발생:', error);
      alert('서버 연결에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div>
      <div className={style.header}>
        <h1>개인 정보 수정</h1>
      </div>
      <form className={style.myInfoModify} id="MyInfoModify" onSubmit={handleSubmitUpdate}>
        <section className={style.ListForm}>
          <label>이메일</label>
          <input
            type="text"
            name="email"
            value={email}
            disabled
            readOnly
            className={style.disabledInput}
          />
        </section>
        <section className={style.ListForm}>
          <label>이름</label>
          <input
            type="text"
            name="name"
            value={name}
            disabled
            readOnly
            className={style.disabledInput}
          />
        </section>
        <section className={style.ListForm}>
          <label>닉네임</label>
          <div className={style.inputWithButton2}>
            <input
              type="text"
              name="displayName"
              value={displayName}
              onChange={handleChangeInputs}
              placeholder="닉네임을 입력해 주세요"
            />
            <Button
              name="중복 확인"
              onClick={handleCheckNickname}
              isPurple={true}
            />
          </div>
          {nicknameError && <p className={style.error}>{nicknameError}</p>}
        </section>
        <section className={style.ListForm}>
          <label>휴대폰 번호</label>
          <input
            type="text"
            name="phoneNumber"
            value={phoneNumber}
            onChange={handleChangeInputs}
            placeholder="휴대폰 번호를 입력해 주세요"
          />
        </section>
        <section className={style.ListForm}>
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
        <section className={style.btn}>
          <Button name="회원정보 수정" form="MyInfoModify" type="submit" isBrown={true} />
        </section>
      </form>
    </div>
  );
};

export default MyInfo;
