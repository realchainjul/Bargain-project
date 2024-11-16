import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav/Navbar';
import Footer from './components/Footer/Footer';
import Home from './Pages/Home/Home';
import FruitsPage from './Pages/Category/Fruits/FruitsPage';
import Login from './Pages/Login/Login';
import VegetablePage from './Pages/Category/Vegetable/VegetablePage';
import GrainPage from './Pages/Category/Grain/GrainPage';
import Signup from './Pages/Signup/Signup';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState('');

  // 세션 정보를 확인하여 로그인 상태 설정
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('https://api.bargainus.kr/info', { withCredentials: true });
        if (response.status === 200 && response.data.nickname) {
          setIsLoggedIn(true);
          setNickname(response.data.nickname);
        }
      } catch (error) {
        console.error('로그인 상태 확인 실패:', error);
        setIsLoggedIn(false);
        setNickname('');
      }
    };
    fetchUserInfo();
  }, [isLoggedIn]);

  const handleLogout = async () => {
    try {
      const response = await axios.post('https://api.bargainus.kr/logout', null, { withCredentials: true });
      if (response.data.status) {
        setIsLoggedIn(false);
        setNickname('');
        alert('로그아웃 되었습니다.');
      }
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <BrowserRouter>
      <Nav isLoggedIn={isLoggedIn} nickname={nickname} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLoginSuccess={setIsLoggedIn} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/category/fruits" element={<FruitsPage />} />
        <Route path="/category/vegetable" element={<VegetablePage />} />
        <Route path="/category/grain" element={<GrainPage />} />
        <Route
          path="/mypage"
          element={isLoggedIn ? <div>마이페이지 준비 중</div> : <Navigate to="/login" />}
        />
        <Route
          path="/likepage"
          element={isLoggedIn ? <div>찜 목록 준비 중</div> : <Navigate to="/login" />}
        />
        <Route
          path="/cartpage"
          element={isLoggedIn ? <div>장바구니 준비 중</div> : <Navigate to="/login" />}
        /> 
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
