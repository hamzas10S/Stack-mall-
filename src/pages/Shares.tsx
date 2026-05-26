import { useState } from 'react';
import { ChevronRight, FileText, Trophy, Wallet, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { buyPackage, getUserBalance, getUserInfo } from '../utils/user';
import { useTranslation } from '../context/LanguageContext';

const shares = [
  {
    id: 'SM-AIFM-30',
    title: 'SM-AIFM-30',
    limit: '4',
    yieldAmt: '$35.40',
    price: '$50.00',
    issueNum: '1000',
    date: '2026-3-22~2026-7-1'
  },
  {
    id: 'SM-AIFM-90',
    title: 'SM-AIFM-90',
    limit: '10',
    yieldAmt: '$173.70',
    price: '$50.00',
    issueNum: '1000',
    date: '2026-3-22~2026-7-1'
  },
  {
    id: 'SM-AIFM-360',
    title: 'SM-AIFM-360',
    limit: '20',
    yieldAmt: '$777.60',
    price: '$50.00',
    issueNum: '10000',
    date: '2026-2-9~2027-1-1'
  },
  {
    id: 'AIFM-2026-180',
    title: 'AIFM-2026-180',
    limit: '20',
    yieldAmt: '$460.80',
    price: '$50.00',
    issueNum: '10000',
    date: '2026-2-20~2026-5-20'
  }
];

export default function Shares() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [balance, setBalance] = useState(getUserBalance());
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');

  const userInfo = getUserInfo();

  const handleBuy = (item: typeof shares[0]) => {
    setMessage('');
    const priceNum = parseFloat(item.price.replace('$', ''));
    
    const result = buyPackage(userInfo.id, item.id, priceNum);
    if (result.success) {
      setMsgType('success');
      setMessage(result.message);
      setBalance(getUserBalance()); // Refresh local react state balance
    } else {
      setMsgType('error');
      setMessage(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6fa] font-sans pb-6" dir="rtl">
      {/* Header */}
      <header className="bg-[#3a7af2] text-white flex items-center justify-between h-[50px] px-4 sticky top-0 z-50 animate-fade-in">
        <button onClick={() => navigate(-1)} className="p-1 -mr-1">
          <ChevronRight size={26} strokeWidth={2} />
        </button>
        <h1 className="text-[17px] font-bold text-center flex-1">{t("شراء الأسهم")}</h1>
        <button className="p-1 -ml-1">
          <FileText size={22} strokeWidth={2} />
        </button>
      </header>

      {message && (
        <div className={`mx-2.5 p-3 rounded-lg flex items-center gap-2 text-xs font-bold leading-normal ${
          msgType === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-600'
        }`}>
          {msgType === 'success' ? <CheckCircle2 size={16} className="text-green-600 font-bold shrink-0" /> : <AlertCircle size={16} className="text-red-500 shrink-0" />}
          <span>{message}</span>
        </div>
      )}

      <div className="p-2.5 mt-1 space-y-2.5">
        {shares.map((item) => (
          <div key={item.id} className="bg-white rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden pb-3">
            
            {/* Banner */}
            <div className="h-[90px] bg-gradient-to-r from-[#b3d4ff] via-[#d4c3f5] to-[#c9a7ed] relative flex flex-col justify-center px-4">
               {/* Abstract background decorative elements mimicking the 3d graphics */}
               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,_#fff_0%,_transparent_60%)]"></div>
               <div className="absolute right-[5%] bottom-[10%] opacity-20 w-24 h-24 bg-purple-500 rounded-full blur-xl"></div>
               <div className="absolute left-[10%] top-[20%] opacity-20 w-16 h-16 bg-blue-500 rounded-full blur-lg"></div>
               
               <div className="relative z-10 flex items-center gap-2 mb-1">
                 <div className="w-[26px] h-[26px] bg-white rounded-full flex items-center justify-center shadow-sm">
                   <div className="text-[#e23f66] font-bold text-[14px] font-mono leading-none mt-0.5">SM</div>
                 </div>
                 <div className="text-[20px] text-gray-800 font-bold tracking-tight">Stack Mall</div>
               </div>
               <div className="relative z-10 text-white font-bold text-[24px] tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] font-mono" style={{ textShadow: '2px 2px 4px rgba(100,0,200,0.3), -1px -1px 0 rgba(255,255,255,0.5)' }}>
                 {item.title}
               </div>

               {/* Right side illustration placeholder */}
               <div className="absolute left-[5%] top-1/2 -translate-y-1/2 w-16 h-16 opacity-60 pointer-events-none">
                 <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg text-purple-800">
                   <path fill="currentColor" opacity="0.1" d="M40 160h120V40H40v120zm20-100h80v80H60V60z"/>
                   <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="12" opacity="0.3"/>
                   <path stroke="currentColor" strokeWidth="12" strokeLinecap="round" d="M130 130l30 30" opacity="0.5"/>
                 </svg>
               </div>
            </div>

            <div className="px-3 mt-2">
               <div className="flex justify-between items-center mb-0.5">
                 <h3 className="font-bold text-[15px] text-[#1e293b] font-mono">{item.title}</h3>
                 <Trophy size={20} className="text-[#facc15]" fill="#facc15" />
               </div>
               <div className="text-[11px] text-[#94a3b8] font-medium flex items-center gap-1 mb-2.5">
                 {t("يقتصر على عملية شراء واحدة لكل شخص")}: <span className="text-[#eab308] font-bold text-[13px]">{item.limit}</span>
               </div>

               <div className="grid grid-cols-3 text-center mb-2.5">
                 <div className="flex flex-col items-center">
                    <span className="text-[#3a7af2] font-bold text-[14px] font-mono leading-tight">{item.issueNum}</span>
                    <span className="text-[#94a3b8] text-[10px] font-medium mt-0.5">{t("رقم الإصدار")}</span>
                 </div>
                 <div className="flex flex-col items-center">
                    <span className="text-[#3a7af2] font-bold text-[14px] font-mono leading-tight">{item.price}</span>
                    <span className="text-[#94a3b8] text-[10px] font-medium mt-0.5">{t("سعر")}</span>
                 </div>
                 <div className="flex flex-col items-center">
                    <span className="text-[#3a7af2] font-bold text-[14px] font-mono leading-tight">{item.yieldAmt}</span>
                    <span className="text-[#94a3b8] text-[10px] font-medium mt-0.5">{t("يحصل")}</span>
                 </div>
               </div>

               <div className="flex justify-between items-center mb-3 border-t border-gray-50 pt-2">
                 <span className="text-[#94a3b8] text-[11px] font-medium">{t("تاريخ الافراج عنه")}</span>
                 <span className="text-[#3a7af2] text-[11px] font-mono">{item.date}</span>
               </div>

               <button 
                 onClick={() => handleBuy(item)}
                 className="w-full bg-[#3a7af2] hover:bg-blue-600 cursor-pointer transition-colors text-white py-1.5 rounded-lg font-bold text-[13px] shadow-sm shadow-blue-500/20 active:scale-[0.98]"
               >
                 {t("يشتري")}
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
