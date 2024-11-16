import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav/Navbar';
import Footer from './components/Footer/Footer';
import Home from './Pages/Home/Home';
import FruitsPage from './Pages/Category/Fruits/FruitsPage';
import Login from './Pages/Login/Login';
import VegetablePage from './Pages/Category/Vegetable/VegetablePage';
import GrainPage from './Pages/Category/Grain/GrainPage';
import Signup from './Pages/Signup/Signup';
import MyPage from './Pages/Mypage/Mypage';
import LikePage from './Pages/Like/LikePage';
import CartPage from './Pages/Cart/CartPage';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState('');
  const Placeholder = ({ message }) => <div>{message}</div>;

  useEffect(() => {
    console.log('isLoggedIn:', isLoggedIn);
    console.log('nickname:', nickname);
  }, [isLoggedIn, nickname]); // 상태 변화 감지

 useEffect(() => {
  const checkLoginStatus = async () => {
    try {
      const response = await axios.get('https://api.bargainus.kr/info', {
        withCredentials: true,
      });
      if (response.status === 200 && response.data.status) {
        setIsLoggedIn(true);
        setNickname(response.data.nickname);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  checkLoginStatus();
}, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post('https://api.bargainus.kr/logout', null, {
        withCredentials: true,
      });
      if (response.data.status) {
        setIsLoggedIn(false);
        setNickname('');
      }
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <BrowserRouter>
      {/* NavBar에 로그인 상태와 로그아웃 함수 전달 */}
      <Nav isLoggedIn={isLoggedIn} nickname={nickname} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/category/fruits" element={<FruitsPage />} />
        <Route path="/category/vegetable" element={<VegetablePage />} />
        <Route path="/category/grain" element={<GrainPage />} />
        {/* 로그인한 사용자만 접근 가능한 페이지 */}
        <Route
          path="/mypage"
          element={isLoggedIn ? <Placeholder message="마이페이지가 준비 중입니다." /> : <Navigate to="/login" />}
        />
        <Route
         path="/mypage/like"
          element={isLoggedIn ? <Placeholder message="찜목록 페이지 준비 중입니다." /> : <Navigate to="/login" />}
        />
        <Route
          path="/mypage/cart"
          element={isLoggedIn ? <Placeholder message="장바구니 페이지 준비 중입니다." /> : <Navigate to="/login" />}
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
