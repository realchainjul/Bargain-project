import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav/Navbar';
import Footer from './components/Footer/Footer';
import Home from './Pages/Home/Home';
import FruitsPage from './Pages/Category/Fruits/FruitsPage';
import Login from './Pages/Login/Login';
import VegetablePage from './Pages/Category/Vegetable/VegetablePage';
import GrainPage from './Pages/Category/Grain/GrainPage';
import Signup from './Pages/Signup/Signup';
import LikePage from './Pages/Like/LikePage';
import CartPage from './Pages/Cart/CartPage';
import MyPage from './Pages/Mypage/UserPage';
import MyInfo from './Pages/Mypage/MyInfo/MyInfo';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState('');

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
  }, []);

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
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setNickname={setNickname} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/category/fruits" element={<FruitsPage />} />
        <Route path="/category/vegetable" element={<VegetablePage />} />
        <Route path="/category/grain" element={<GrainPage />} />
        <Route
  path="/mypage/like"
  element={isLoggedIn ? <LikePage /> : <Navigate to="/login" />}
/>
<Route
  path="/mypage/cart"
  element={isLoggedIn ? <CartPage /> : <Navigate to="/login" />}
/>
<Route
  path="/mypage/userpage"
  element={ <MyPage /> }
>
  {/* 기본 경로에서 /info로 리다이렉트 */}
  <Route index element={<Navigate to="/mypage/userpage/info" />} />
  {/* 하위 경로 */}
  <Route path="info" element={<MyInfo
  />} />
</Route>

      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
