import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Mall from './pages/Mall';
import Recharge from './pages/Recharge';
import Withdraw from './pages/Withdraw';
import Vip from './pages/Vip';
import Team from './pages/Team';
import Register from './pages/Register';
import Login from './pages/Login';
import Income from './pages/Income';
import Rewards from './pages/Rewards';
import About from './pages/About';
import Help from './pages/Help';
import Profile from './pages/Profile';
import Records from './pages/Records';
import ChangePassword from './pages/ChangePassword';
import ChangePayPassword from './pages/ChangePayPassword';
import Shares from './pages/Shares';
import LanguageSelect from './pages/LanguageSelect';
import AdminDashboard from './pages/AdminDashboard';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Pages with bottom navigation */}
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/mall" element={<Mall />} />
            <Route path="/team" element={<Team />} />
            <Route path="/vip" element={<Vip />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Full-screen pages without bottom navigation */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recharge" element={<Recharge />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/income" element={<Income />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/records" element={<Records />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          <Route path="/shares" element={<Shares />} />
          <Route path="/language" element={<LanguageSelect />} />
          <Route path="/admin/qlbliop67Q" element={<AdminDashboard />} />
          <Route path="/settings/password/login" element={<ChangePassword />} />
          <Route path="/settings/password/payment" element={<ChangePayPassword />} />

          {/* Fallback */}
          <Route path="*" element={<div className="p-8 text-center bg-slate-50 min-h-screen">Placeholder for page</div>} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
