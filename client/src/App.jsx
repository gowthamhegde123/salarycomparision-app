import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import SalaryDetail from './pages/SalaryDetail';
import Compare from './pages/Compare';
import Submit from './pages/Submit';
import Login from './pages/Login';
import Register from './pages/Register';
import SalaryPredictor from './pages/SalaryPredictor';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 gradient-mesh">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/salary/:id" element={<SalaryDetail />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/predictor" element={<SalaryPredictor />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
