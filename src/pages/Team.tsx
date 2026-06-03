import { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { getUserInfo, getTeamStats } from '../utils/user';
import { useTranslation } from '../context/LanguageContext';

export default function Team() {
  const [activeTab, setActiveTab] = useState('A');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const navigate = useNavigate();
  const { t, dir } = useTranslation();

  const userInfo = getUserInfo();
  const stats = getTeamStats();

  const inviteCode = userInfo.id;
  const inviteUrl = userInfo.inviteUrl || `${window.location.origin}/register?ref=${inviteCode}`;

  const handleCopy = (text: string, setter: any) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const tabs = [
    { id: 'A', label: 'فريق A' },
    { id: 'B', label: 'فريق B' },
    { id: 'C', label: 'فريق C' }
  ];

  return (
    <div className="min-h-full font-sans flex flex-col bg-[#3a7af2]" dir={dir}>
      {/* Header */}
      <header className="bg-[#3a7af2] text-white flex items-center h-[50px] px-4 sticky top-0 z-50 shrink-0">
        <button onClick={() => navigate(-1)} className="p-1 -mr-1">
          {dir === "rtl" ? <ChevronRight size={26} strokeWidth={2} /> : <ChevronLeft size={26} strokeWidth={2} />}
        </button>
        <h1 className="text-[17px] font-bold text-center flex-1 ml-6">{t("فريقي")}</h1>
      </header>

      {/* The Blue background with gradient */}
      <div className="bg-gradient-to-b from-[#56a7ff] to-[#245ce0] px-3 pt-3 pb-6 flex-1">
        {/* First Card */}
        <div className="bg-[#eaf1ff] rounded-[16px] p-4 shadow-sm relative overflow-hidden mb-4 flex flex-col gap-4">
          <div className="flex justify-between items-center">
             <div className="flex flex-col items-start gap-0.5 overflow-hidden flex-1 pr-2">
               <span className="text-[#6c91cc] font-bold text-[11px]">{t("رمز الدعوة")}</span>
               <span className="font-bold text-[22px] sm:text-[18px] text-[#1f4a9b] break-all max-w-[200px] leading-tight mt-1">{inviteCode.length > 20 ? inviteCode.substring(0, 13) + '...' : inviteCode}</span>
             </div>
             <button 
               onClick={() => handleCopy(inviteCode, setCopiedCode)}
               className="bg-[#3a7af2] hover:bg-blue-600 text-white px-5 py-1 rounded-full font-bold text-[13px] shadow-sm active:scale-95 transition-all w-[80px] shrink-0"
             >
               {copiedCode ? t("تم!") : t("ينسخ")}
             </button>
          </div>

          <div className="flex justify-between items-center">
             <div className="flex flex-col items-start gap-0.5 flex-1 overflow-hidden pr-2">
               <span className="text-[#6c91cc] font-bold text-[11px]">{t("رابط الدعوة")}</span>
               <span className="text-slate-600 font-medium text-[11px] truncate w-[160px] text-left" dir="ltr">{inviteUrl}</span>
             </div>
             <button 
               onClick={() => handleCopy(inviteUrl, setCopiedLink)}
               className="bg-[#3a7af2] hover:bg-blue-600 text-white px-5 py-1 rounded-full font-bold text-[13px] shadow-sm active:scale-95 transition-all w-[80px] shrink-0"
             >
               {copiedLink ? t("تم!") : t("ينسخ")}
             </button>
          </div>
        </div>
      </div>

      {/* White bottom section */}
      <div className="bg-white rounded-t-[16px] p-4 -mt-6 z-10 flex-1 min-h-[300px]">
        <h3 className="font-bold text-[13px] mb-2 text-gray-800">{t("فريق")}</h3>
        
        {/* Tabs */}
        <div className="flex justify-center mb-4">
           <div className="flex border border-gray-800 rounded-md overflow-hidden bg-white w-full max-w-sm" dir="ltr">
              {tabs.map((tab, idx) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    "flex-1 py-1 text-[13px] font-bold transition-all border-gray-800",
                    idx !== 0 ? "border-l" : "",
                    activeTab === tab.id 
                      ? "bg-[#3a7af2] text-white" 
                      : "text-gray-800"
                  )}
                >
                  {t(tab.label)}
                </button>
              ))}
           </div>
        </div>

        {/* Stats */}
        <div className="bg-[#3a7af2] rounded-lg p-3 text-white flex justify-between shadow-sm mb-2 text-center" dir={dir}>
           <div className="flex-1 border-l rounded-none border-white/20 px-1">
              <div className="text-white/80 mb-1 font-medium text-[11px] leading-tight">{t("حجم الفريق")}</div>
              <div className="font-bold text-lg">{stats.teamSize}</div>
           </div>
           <div className="flex-1 border-l rounded-none border-white/20 px-1">
              <div className="text-white/80 mb-1 font-medium text-[11px] leading-tight">{t("غير مشحونة")}</div>
              <div className="font-bold text-lg">{stats.unrechargedUsers}</div>
           </div>
           <div className="flex-1 px-1">
              <div className="text-white/80 mb-1 font-medium text-[11px] leading-tight">{t("المستخدمون الصالحون")}</div>
              <div className="font-bold text-lg">{stats.validUsers}</div>
           </div>
        </div>
      </div>
    </div>
  );
}
