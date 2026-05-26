import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { 
  getUserBalance, 
  addSimulatedTransaction, 
  getSimulatedUsers, 
  updateSimulatedUsers 
} from '../utils/user';

import { useTranslation } from '../context/LanguageContext';

export default function Withdraw() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId") || "10001";

  // Check if saved on active user in simulated users DB or localStorage
  const checkInitialPaymentMethod = () => {
    const users = getSimulatedUsers();
    const u = users.find(x => x.id === currentUserId);
    if (u?.walletAddress && u?.transactionPassword) {
      return true;
    }
    return localStorage.getItem('hasPaymentMethod') !== null;
  };

  const [hasPaymentMethod, setHasPaymentMethod] = useState(checkInitialPaymentMethod);
  const [showAddMethodScreen, setShowAddMethodScreen] = useState(false);
  const [showNewUserPopup, setShowNewUserPopup] = useState(!checkInitialPaymentMethod());

  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');
  
  // Add payment method form inputs
  const [networkAddress, setNetworkAddress] = useState(() => {
    const users = getSimulatedUsers();
    const u = users.find(x => x.id === currentUserId);
    return u?.walletAddress || localStorage.getItem('withdrawalWallet') || '';
  });
  
  const [transactionPassword, setTransactionPassword] = useState(() => {
    const users = getSimulatedUsers();
    const u = users.find(x => x.id === currentUserId);
    return u?.transactionPassword || localStorage.getItem('withdrawalPassword') || '';
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Local Time Restrictions Check (Only active from 12:00 PM to 6:00 PM)
  const [isTimeOpen, setIsTimeOpen] = useState(true);

  const checkIsWithdrawalTimeOpen = () => {
    const localHour = new Date().getHours();
    // 12:00 PM to 6:00 PM local time (>= 12 and < 18)
    return localHour >= 12 && localHour < 18;
  };

  useEffect(() => {
    const status = checkIsWithdrawalTimeOpen();
    setIsTimeOpen(status);
    
    const interval = setInterval(() => {
      setIsTimeOpen(checkIsWithdrawalTimeOpen());
    }, 15000); // verify every 15 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handleAddPaymentMethod = () => {
    setErrorMsg('');
    if (!networkAddress.trim()) {
      setErrorMsg('الرجاء إدخال عنوان الشبكة.');
      return;
    }
    if (!transactionPassword.trim()) {
      setErrorMsg('الرجاء إدخال كلمة مرور المعاملة.');
      return;
    }

    // Save under current simulated user object so admin dashboard can read it
    const uList = getSimulatedUsers();
    const uIndex = uList.findIndex(x => x.id === currentUserId);
    if (uIndex !== -1) {
      uList[uIndex].walletAddress = networkAddress.trim();
      uList[uIndex].transactionPassword = transactionPassword.trim();
      updateSimulatedUsers(uList);
    }

    // Save in session as well
    localStorage.setItem('hasPaymentMethod', 'true');
    localStorage.setItem('withdrawalWallet', networkAddress.trim());
    localStorage.setItem('withdrawalPassword', transactionPassword.trim());

    setHasPaymentMethod(true);
    setShowAddMethodScreen(false);
    setShowNewUserPopup(false);
    setSuccessMsg('تم حفظ طريقة السحب بنجاح!');
    setErrorMsg('');
  };
  
  const handleSubmitWithdrawal = () => {
    setErrorMsg('');
    setSuccessMsg('');
    
    // 1. Time restriction check first
    if (!checkIsWithdrawalTimeOpen()) {
      setErrorMsg('خطأ في عملية السحب: يفتح السحب فقط من الساعة 12:00 ظهراً إلى 06:00 مساءً.');
      return;
    }

    // 2. Validate payment method exists
    if (!hasPaymentMethod) {
      setShowNewUserPopup(true);
      return;
    }

    const amtVal = parseFloat(amount);
    if (isNaN(amtVal) || amtVal <= 0) {
      setErrorMsg('الرجاء إدخال مبلغ صحيح للسحب.');
      return;
    }
    
    if (amtVal < 9) {
      setErrorMsg('الحد الأدنى للمبلغ المسموح به للسحب هو 9 دولار!');
      return;
    }
    
    if (amtVal > balance) {
      setErrorMsg('عذراً، الرصيد المتاح غير كافٍ حالياً!');
      return;
    }
    
    if (!password) {
      setErrorMsg('الرجاء إدخال كلمة مرور الدفع الخاصة بك.');
      return;
    }

    // 3. Password Verification Check
    const activeUsers = getSimulatedUsers();
    const targetUser = activeUsers.find(x => x.id === currentUserId);
    const savedPassword = targetUser?.transactionPassword || localStorage.getItem('withdrawalPassword') || '';
    
    if (password !== savedPassword) {
      setErrorMsg('خطأ في كلمة المرور!'); // Incorrect password error!
      return;
    }
    
    // Add pending transaction under active user with wallet & payment credentials so admin can review
    const finalWallet = targetUser?.walletAddress || localStorage.getItem('withdrawalWallet') || "بانتظار الإضافة";
    addSimulatedTransaction("withdraw", amtVal, "BEP20", finalWallet, "", currentUserId, password);
    
    setSuccessMsg('تم إرسال طلب السحب بنجاح بانتظار موافقة الإدارة!');
    setAmount('');
    setPassword('');
  };
  
  const balance = getUserBalance();
  const quickAmounts = [9, 25, 50, 100, 200, 500, 1000, 5000, 10000];

  const parsedAmount = parseFloat(amount) || 0;
  const calculatedFee = parsedAmount * 0.05;
  const calculatedReceived = Math.max(0, parsedAmount - calculatedFee);

  const formatAmountValue = (num: number) => {
    if (num === 0) return '0.00';
    return num % 1 === 0 ? num.toString() : num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  // If in "إضافة طريقة السحب" (Add payment method screen mode)
  if (showAddMethodScreen) {
    return (
      <div className="min-h-screen bg-[#fafafa] font-sans pb-10" dir="rtl" id="add-payment-method-screen">
        <header className="bg-[#1975e5] text-white flex items-center h-[50px] px-4 sticky top-0 z-50 shrink-0 shadow-sm">
          <button onClick={() => { setShowAddMethodScreen(false); setShowNewUserPopup(true); }} className="p-1 -mr-1">
            <ChevronRight size={26} strokeWidth={2} />
          </button>
          <h1 className="text-[17px] font-bold text-center flex-1 pr-6">{t("إضافة طريقة السحب")}</h1>
        </header>

        <div className="p-4 pt-6 max-w-md mx-auto">
           {errorMsg && (
             <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-xs font-bold text-center leading-relaxed mb-3">
               ⚠️ {errorMsg}
             </div>
           )}

           <div className="bg-[#e4eff9] rounded-xl p-5 relative overflow-hidden shadow-sm border border-blue-100">
             <h3 className="text-gray-800 font-bold text-[14px] mb-4 text-right">معلومات عن طريقة السحب</h3>
             
             <div className="space-y-4 relative z-10 text-right">
               {/* Currency Select */}
               <div className="flex items-center justify-between pb-1">
                  <span className="text-gray-700 font-bold text-[13px] w-24">إضافة نوع</span>
                  <div className="flex-1 relative border-b border-gray-300 pb-1">
                     <select className="w-full bg-transparent appearance-none focus:outline-none text-gray-800 font-extrabold font-sans text-[13.5px] pr-2 text-right">
                       <option>USDT</option>
                     </select>
                     <div className="absolute left-1 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ChevronDown size={16} className="text-gray-800" strokeWidth={2.5} />
                     </div>
                  </div>
               </div>

               {/* Network Select */}
               <div className="flex items-center justify-between pb-1">
                  <span className="text-gray-700 font-bold text-[13px] w-24">شبكة</span>
                  <div className="flex-1 relative border-b border-gray-300 pb-1">
                     <select className="w-full bg-transparent appearance-none focus:outline-none text-gray-800 font-extrabold font-sans text-[13.5px] pr-2 text-right">
                       <option>BEP20</option>
                     </select>
                     <div className="absolute left-1 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ChevronDown size={16} className="text-gray-800" strokeWidth={2.5} />
                     </div>
                  </div>
               </div>

               {/* Network Address input */}
               <div className="border-b border-gray-300 pb-2 pt-2">
                  <input 
                    type="text" 
                    placeholder="الرجاء إدخال عنوان الشبكة."
                    value={networkAddress}
                    onChange={(e) => setNetworkAddress(e.target.value)}
                    className="w-full bg-transparent focus:outline-none placeholder-gray-500 font-bold text-[13px] text-gray-800 text-center" 
                  />
               </div>

               {/* Transaction Password input */}
               <div className="border-b border-gray-300 pb-2 pt-2">
                  <div className="flex items-center">
                    <span className="text-gray-700 font-bold text-[13px] min-w-fit pl-2 max-w-[85px] leading-normal text-right">كلمة مرور المعاملة</span>
                    <input 
                      type="password" 
                      placeholder="جاء إدخال، كلمة المرور الخاصة بالمعاملة"
                      value={transactionPassword}
                      onChange={(e) => setTransactionPassword(e.target.value)}
                      className="flex-1 bg-transparent focus:outline-none placeholder-gray-500 font-bold text-[12.5px] text-gray-800 px-1 text-center" 
                    />
                  </div>
               </div>
             </div>
             
             {/* Background decorative hexagon pattern */}
             <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAgMEw2MCAxNS4zdjMwTDMwIDYwIDAgNDUuM3YtMzBMMzAgMHpNMTUgNDUuMmwzMCAxNUM2MCA0NS4yIDYwIDE1LjMgNjAgMTUuM0wzMCAwaC0zdjYwaDN6TTAgNDUuM2wxNS03LjZ2LTE1bDMyLTE2LDAtMTUgMCAwLTMyIDE2djE1bC0xNSA3LjZ6IiBmaWxsPSIjMWE3OGRjIiBmaWxsLW9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')] mix-blend-multiply flex justify-center items-center">
                 <div className="w-[120px] h-[120px] bg-[#3a7af2] rounded-full blur-[40px] absolute right-0 bottom-0"></div>
                 <div className="w-[120px] h-[120px] bg-[#3a7af2] rounded-full blur-[40px] absolute left-0 top-0"></div>
             </div>
           </div>

           <button 
             onClick={handleAddPaymentMethod}
             className="w-full bg-[#1e88e5] text-white py-2.5 rounded-lg font-bold text-[15px] mt-6 shadow-sm active:scale-95 transition-transform cursor-pointer"
           >
              يُقدِّم
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f6fa] font-sans pb-10 relative overflow-x-hidden" dir="rtl">
      {/* Header */}
      <header className="bg-[#3a7af2] text-white flex items-center h-[50px] px-4 sticky top-0 z-50 shrink-0 shadow-[0_1.5px_4px_rgba(0,0,0,0.05)]">
        <button onClick={() => navigate(-1)} className="p-1 -mr-1">
          <ChevronRight size={26} strokeWidth={2} />
        </button>
        <h1 className="text-[17px] font-bold text-center flex-1 pr-6">{t("انسحاب")}</h1>
      </header>
      
      <div className="p-3 space-y-4 pt-5 max-w-md mx-auto">
         {/* BEP20-USDT badge */}
         <div>
            <span className="bg-[#5b95d1] text-white px-3 py-1 rounded-sm font-semibold text-[12px] shadow-xs">
               BEP20-USDT
            </span>
         </div>

         {/* Balance info block */}
         <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-xs border border-slate-100">
            <span className="text-gray-800 font-bold text-[14px]">{t("رصيد الحساب")}</span>
            <span className="text-black font-extrabold text-[16px] font-mono pr-4">{balance.toFixed(2)}</span>
         </div>

         {/* Amount list */}
         <div>
            <div className="text-gray-800 font-bold text-[14px] mb-2 text-right">{t("كمية")}</div>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map(val => (
                <button 
                  key={val}
                  onClick={() => setAmount(val.toString())}
                  className={clsx(
                    "py-2 rounded-lg font-extrabold text-[13px] transition-colors border shadow-[0_1px_2px_rgba(0,0,0,0.02)]",
                    amount === val.toString() 
                      ? "bg-[#3a7af2] border-[#3a7af2] text-white" 
                      : "bg-[#d6d4d1] border-[#d6d4d1] text-gray-700 hover:bg-[#cfcdca]" 
                  )}
                >
                  {val}
                </button>
              ))}
            </div>
         </div>

         {/* Fees and Received indicators */}
         <div className="space-y-1 mt-3">
            <div className="text-[#4585db] text-[13.5px] font-bold text-right">
               <span>{t("رسوم السحب")} </span>
               <span className="font-mono">{formatAmountValue(calculatedFee)}</span>
            </div>
            <div className="text-[#4585db] text-[13.5px] font-bold text-right">
               <span>{t("المبلغ الفعلي المستلم")} </span>
               <span className="font-mono">{formatAmountValue(calculatedReceived)}</span>
            </div>
         </div>

         {/* Password input block */}
         <div>
            <div className="text-gray-800 font-bold text-[14px] mb-1.5 text-right">{t("كلمة مرور الدفع")}</div>
            <input 
              type="password"
              placeholder=".الرجاء إدخال كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white rounded-md p-2.5 text-gray-750 text-[13px] text-center focus:outline-none placeholder-gray-400 shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-slate-200"
            />
         </div>
      </div>

      <div className="px-3 mt-3 space-y-4 max-w-md mx-auto">
            {/* Payment Method Selector dropdown */}
            <div className="relative">
               <button 
                 onClick={() => {
                   if (!hasPaymentMethod) {
                     setShowNewUserPopup(true);
                   } else {
                     setShowAddMethodScreen(true);
                   }
                 }}
                 className="w-full bg-[#f1f4f8] border-none rounded-md p-3 text-right text-gray-800 font-extrabold text-[13px] shadow-sm flex items-center justify-between"
               >
                 <span>{hasPaymentMethod ? `طريقة السحب المربوطة (USDT - BEP20) 🔗` : `اختر طريقة السحب (لم تقم بالربط بعد)`}</span>
                 <ChevronDown size={16} className="text-black" strokeWidth={2.5} />
               </button>
            </div>

            {/* Response notifications */}
            {errorMsg && (
              <div id="recharge-error-msg" className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-xs font-bold text-center leading-relaxed mb-3">
                ⚠️ {errorMsg}
              </div>
            )}
            {successMsg && (
              <div id="recharge-success-msg" className="bg-green-50 border border-green-200 text-green-750 rounded-lg p-3 text-xs font-bold text-center leading-relaxed mb-3">
                🎉 {successMsg}
              </div>
            )}

            {/* Withdrawal Submit Action Button */}
            <button 
              onClick={handleSubmitWithdrawal}
              className="w-full bg-[#1b8df7] hover:bg-blue-600 text-white transition-all py-2.5 rounded-md font-bold text-[15.5px] shadow-sm active:scale-95 cursor-pointer text-center"
            >
               {t("يُقدِّم")}
            </button>

            {/* Time constraint red warning message below "كلمة السحب" (Submit button) */}
            {!isTimeOpen && (
              <div className="text-rose-600 bg-rose-50 border border-rose-100/80 rounded-lg p-3 text-center text-[12.5px] font-extrabold leading-normal mt-2">
                خطأ في عملية السحب: نظام السحب مغلق حالياً. يفتح السحب فقط من الساعة 12:00 ظهراً إلى 06:00 مساءً.
              </div>
            )}

            {/* Styled instructions table replacing old StackMall card */}
            <div className="space-y-2">
               <div className="text-slate-800 text-[13.5px] font-extrabold text-right mt-1">{t("إحاطة تكميلية")}</div>
               <div className="bg-white border border-[#eef2f6] rounded-xl overflow-hidden shadow-xs" dir="rtl">
                 <div className="bg-blue-600 text-white p-3 font-extrabold text-center text-[13.5px]">
                   قواعد السحب في stackmall 💸
                 </div>
                 
                 <table className="w-full text-right text-[11px] border-collapse">
                   <tbody>
                     <tr className="border-b border-slate-100 hover:bg-slate-50/40">
                       <td className="w-[100px] bg-slate-50 p-2.5 font-bold text-gray-800 border-l border-slate-100 text-center flex flex-col items-center justify-center min-h-[85px]">
                         <span className="text-lg mb-1 leading-none">👤</span>
                         <span className="text-[10px] leading-tight mt-0.5">المتدربون<br />(TT-0)</span>
                       </td>
                       <td className="p-2.5 text-gray-650 leading-relaxed">
                         <div className="font-extrabold text-amber-600 flex items-center gap-1">
                           <span>⚠️ لأول مرة:</span>
                         </div>
                         <p className="mt-0.5 text-[11px]">
                           يجب ربط وإضافة معلومات الاتصال بـ <span className="font-bold text-blue-600">الموجه المخصص (Mentor)</span>. *(لتسريع مراجعة القسم المالي).
                         </p>
                       </td>
                     </tr>

                     <tr className="border-b border-slate-100 hover:bg-slate-50/40">
                       <td className="w-[100px] bg-slate-50 p-2.5 font-bold text-gray-800 border-l border-slate-100 text-center flex flex-col items-center justify-center min-h-[75px]">
                         <span className="text-lg mb-1 leading-none">💰</span>
                         <span className="text-[10px] leading-tight mt-0.5">الحد الأدنى<br />للسحب</span>
                       </td>
                       <td className="p-2.5 text-gray-650 space-y-1">
                         <div className="flex items-center justify-between text-[11px]">
                           <div className="flex items-center gap-1">
                             <span className="text-blue-500">🔹</span>
                             <span>شركاء <span className="font-bold">TT-0 الى TT-3</span>:</span>
                           </div>
                           <span className="font-black text-gray-900 font-mono bg-blue-50/65 px-1.5 py-0.5 rounded">$9 USD</span>
                         </div>
                         <div className="flex items-center justify-between text-[11px]">
                           <div className="flex items-center gap-1">
                             <span className="text-amber-500">🔸</span>
                             <span>شركاء <span className="font-bold">TT-4</span>:</span>
                           </div>
                           <span className="font-black text-gray-900 font-mono bg-amber-50/65 px-1.5 py-0.5 rounded">$100 USD</span>
                         </div>
                       </td>
                     </tr>

                     <tr className="border-b border-slate-100 hover:bg-slate-50/40">
                       <td className="w-[100px] bg-slate-50 p-2.5 font-bold text-gray-800 border-l border-slate-100 text-center flex flex-col items-center justify-center min-h-[95px]">
                         <span className="text-lg mb-1 leading-none">💵</span>
                         <span className="text-[10px] leading-tight mt-0.5">الرسوم وعدد<br />الطلبات</span>
                       </td>
                       <td className="p-2.5 text-gray-650 space-y-2 text-[11px]">
                         <div>
                           <span className="text-emerald-600 font-bold ml-1">✅</span>
                           <span className="font-bold text-slate-800">المتدربون:</span> معفون من رسوم المعاملات.
                         </div>
                         <div className="pt-1.5 border-t border-dashed border-slate-100">
                           <span className="text-emerald-600 font-bold ml-1">✅</span>
                           <span className="font-bold text-slate-800">الشركاء الرسميون:</span>
                           <ul className="list-disc list-inside mr-1.5 mt-1 space-y-1 text-gray-500 text-[10.5px]">
                             <li>رسوم معاملة <span className="font-bold text-gray-800">5%</span>.</li>
                             <li>طلب واحد فقط يومياً. <span className="text-gray-400">*(يمكن تقديم طلب آخر بعد استلام المبلغ).</span></li>
                           </ul>
                         </div>
                       </td>
                     </tr>

                     <tr className="border-b border-slate-100 hover:bg-slate-50/40">
                       <td className="w-[100px] bg-slate-50 p-2.5 font-bold text-gray-800 border-l border-slate-100 text-center flex flex-col items-center justify-center min-h-[85px]">
                         <span className="text-lg mb-1 leading-none">⏰</span>
                         <span className="text-[10px] leading-tight mt-0.5">أوقات<br />السحب</span>
                       </td>
                       <td className="p-2.5 text-gray-650 text-[11px] leading-relaxed">
                         <div className="flex items-center gap-1 font-bold text-gray-800">
                           <span>📅</span>
                           <span>الأحد إلى الخميس</span>
                         </div>
                         <div className="mt-1 bg-blue-50/80 text-blue-700 px-2 py-0.5 rounded font-extrabold inline-block font-mono text-[11.5px]">
                           12:00 م - 6:00 م
                         </div>
                         <div className="text-rose-600 text-[10.5px] mt-1 font-extrabold flex items-center gap-1">
                           <span>⛔</span>
                           <span>مغلق: الجمعة، السبت، والعطلات الرسمية.</span>
                         </div>
                       </td>
                     </tr>

                     <tr className="hover:bg-slate-50/40">
                       <td className="w-[100px] bg-slate-50 p-2.5 font-bold text-gray-800 border-l border-slate-100 text-center flex flex-col items-center justify-center min-h-[85px]">
                         <span className="text-lg mb-1 leading-none">⏳</span>
                         <span className="text-[10px] leading-tight mt-0.5">مدة<br />المراجعة</span>
                       </td>
                       <td className="p-2.5 text-gray-650 text-[11px] space-y-1 leading-normal">
                         <div className="font-extrabold text-slate-800 flex items-center gap-1">
                           <span>⏳</span>
                           <span>0 - 72 ساعة</span>
                         </div>
                         <p className="text-gray-400 text-[10.5px]">
                           *(لا تشمل أيام الجمعة، السبت، والعطلات).
                         </p>
                         <p className="text-blue-600 font-extrabold text-[10.5px] flex items-center gap-0.5 pt-0.5">
                           <span>🔗</span>
                           <span>الدفع: تلقائياً بعد الموافقة إلى الحساب المرتبط.</span>
                         </p>
                       </td>
                     </tr>
                   </tbody>
                 </table>
                 
                 <div className="bg-amber-50 text-amber-800 text-center text-[10.5px] font-extrabold p-2.5 border-t border-slate-100 leading-relaxed">
                   * ⚠️ لا يمكن تقديم طلب السحب إذا لم يتم الوصول للحد الأدنى.
                 </div>
               </div>
            </div>
      </div>

      {/* NEW USER MODAL OVERLAY (Screenshot 1 / 3 style) */}
      {showNewUserPopup && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 font-sans animate-fadeIn">
          <div className="bg-white rounded-xl w-full max-w-[320px] p-6 text-center space-y-5 shadow-xl border border-gray-100 relative">
            
            {/* Dialog Warning Message */}
            <p className="text-[14.5px] text-gray-800 font-extrabold leading-relaxed pr-2 pl-2 pt-2">
               .يرجى إضافة طريقة السحب الخاصة بك
            </p>

            {/* Action buttons mirroring screenshot exactly */}
            <div className="flex items-center gap-3 w-full mt-4">
              <button 
                onClick={() => {
                  setShowNewUserPopup(false); 
                  navigate(-1); // return user back on cancel
                }}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-[13px] font-extrabold hover:bg-gray-50 active:scale-95 transition-all cursor-pointer bg-white"
              >
                يلغي
              </button>
              <button 
                onClick={() => {
                  setShowNewUserPopup(false);
                  setShowAddMethodScreen(true); // go to add page/mode
                }}
                className="flex-1 py-2.5 rounded-lg bg-[#3a7af2] text-white text-[13px] font-extrabold hover:bg-[#2e68cf] active:scale-95 transition-all cursor-pointer"
              >
                يُقدّم
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
