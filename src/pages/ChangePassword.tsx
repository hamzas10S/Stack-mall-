import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("كلمات المرور غير متطابقة");
      return;
    }
    // Handle password change logic here
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-white font-sans pb-10" dir="rtl">
      {/* Header */}
      <header className="bg-[#3a7af2] text-white flex items-center h-[50px] px-4 sticky top-0 z-50 shrink-0">
        <button onClick={() => navigate(-1)} className="p-1 -mr-1">
          <ChevronRight size={26} strokeWidth={2} />
        </button>
        <h1 className="text-[17px] font-bold text-center flex-1 pr-6">تغيير كلمة المرور لتسجيل الدخول</h1>
      </header>
      
      <div className="p-4 pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-[14.5px] font-medium text-gray-500 pr-1 block">كلمة مرور تسجيل الدخول القديمة</label>
            <input 
              required
              type="password"
              placeholder=".الرجاء إدخال كلمة المرور القديمة لتسجيل الدخول"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full bg-[#f4f6f9] border-none rounded-[10px] p-3.5 focus:outline-none text-[14px] text-gray-700 placeholder-gray-400"
            />
          </div>

          <div className="space-y-1.5 pt-1">
            <label className="text-[14.5px] font-medium text-gray-500 pr-1 block">كلمة مرور تسجيل الدخول الجديدة</label>
            <input 
              required
              minLength={8}
              type="password"
              placeholder=".الرجاء إدخال كلمة المرور الجديدة لتسجيل الدخول"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#f4f6f9] border-none rounded-[10px] p-3.5 focus:outline-none text-[14px] text-gray-700 placeholder-gray-400"
            />
          </div>

          <div className="space-y-1.5 pt-1">
            <label className="text-[14.5px] font-medium text-gray-500 pr-1 block">تأكيد كلمة المرور الجديدة</label>
            <input 
              required
              type="password"
              placeholder=".الرجاء إدخال كلمة المرور الجديدة للتأكيد"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#f4f6f9] border-none rounded-[10px] p-3.5 focus:outline-none text-[14px] text-gray-700 placeholder-gray-400"
            />
          </div>

          <div className="pt-6">
            <button type="submit" className="w-full bg-[#3a7af2] text-white rounded-md py-3.5 font-[600] active:scale-95 transition-transform text-[16px]">
              يحفظ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
