import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav/Navbar';
import Footer from './components/Footer/Footer';
import Home from './Pages/Home/Home';
import FruitsPage from './Pages/Category/Fruits/FruitsPage';
import Login from './Pages/Login/Login';
import VegetablePage from './Pages/Category/Vegetable/VegetablePage';
import GrainPage from './Pages/Category/Grain/GrainPage';
import ExperPage from './Pages/Category/Exper/ExperPage';
import Signup from './Pages/Signup/Signup';

function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <Nav />
      </div>
      <div>
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/category/fruits" element={<FruitsPage />} />
          <Route path="/category/vegetable" element={<VegetablePage />} /> 
          <Route path="/category/grain" element={<GrainPage />} /> 
          <Route path="/category/exper" element={<ExperPage />} />
        </Routes>
      </div>
      <div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
