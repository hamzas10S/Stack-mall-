import Header from '../components/Header';
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ChangePayPassword() {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("كلمات المرور غير متطابقة");
      return;
    }
    // Handle pay password change logic here
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <Header title="تعيين كلمة مرور الدفع" bgClass="bg-header-gradient" />
      
      <div className="p-4 mt-2">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 px-1">كلمة مرور الدفع القديمة</label>
            <div className="relative">
              <input 
                required
                maxLength={6}
                type={showOld ? "text" : "password"}
                placeholder="الرجاء إدخال كلمة المرور القديمة للدفع"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-mono pr-10 text-center tracking-widest font-bold"
              />
              <button 
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-sans"
              >
                {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 px-1">كلمة مرور الدفع الجديدة</label>
            <div className="relative">
              <input 
                required
                minLength={6}
                maxLength={6}
                pattern="[0-9]{6}"
                type={showNew ? "text" : "password"}
                placeholder="6 أرقام جديدة"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-mono pr-10 text-center tracking-widest font-bold"
              />
              <button 
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-sans"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 font-bold px-1 text-center">يجب أن تتكون من 6 أرقام فقط</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 px-1">تأكيد كلمة المرور الجديدة</label>
            <div className="relative">
              <input 
                required
                minLength={6}
                maxLength={6}
                pattern="[0-9]{6}"
                type={showConfirm ? "text" : "password"}
                placeholder="تأكيد 6 أرقام"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-mono pr-10 text-center tracking-widest font-bold"
              />
              <button 
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-sans"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full bg-primary-gradient text-white rounded-xl py-3 font-bold shadow-md hover:shadow-lg active:scale-95 transition-all mt-6 text-sm">
            يحفظ
          </button>
        </form>
      </div>
    </div>
  );
}
