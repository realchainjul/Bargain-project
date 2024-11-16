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

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedNickname = localStorage.getItem('nickname');
    if (token && savedNickname) {
      setIsLoggedIn(true);
      setNickname(savedNickname);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nickname');
    setIsLoggedIn(false);
    setNickname('');
    alert('로그아웃 되었습니다.');
  };

  return (
    <BrowserRouter>
      <Nav isLoggedIn={isLoggedIn} nickname={nickname} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
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
