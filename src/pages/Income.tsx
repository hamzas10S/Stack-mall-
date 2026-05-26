import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { getSimulatedUsers, getTeamStats } from '../utils/user';
import { useMemo } from 'react';

const PACKAGES: Record<string, { price: number, daily_income: number }> = {
  "ST-1": { price: 50.0, daily_income: 2.0 },
  "ST-2": { price: 150.0, daily_income: 6.0 },
  "ST-3": { price: 450.0, daily_income: 18.0 },
  "ST-4": { price: 1440.0, daily_income: 60.0 },
  "ST-5": { price: 3600.0, daily_income: 150.0 },
  "ST-6": { price: 7200.0, daily_income: 360.0 },
  "ST-7": { price: 14400.0, daily_income: 720.0 }
};

export default function Income() {
  const navigate = useNavigate();
  const { t, dir } = useTranslation();

  const {
    todayWorkIncome,
    todayTeamIncome,
    totalToday,
    totalYesterday,
    totalMonth,
    totalRevenue
  } = useMemo(() => {
    const userId = localStorage.getItem("userId") || "10001";
    const users = getSimulatedUsers();
    const user = users.find(u => u.id === userId);
    const packageBought = user?.packageBought || "";
    
    const activePackage = PACKAGES[packageBought] || { price: 0, daily_income: 0 };
    const { validUsers } = getTeamStats();
    
    // Work income today is the daily_income of the user's own package
    const workIncomeToday = activePackage.daily_income;
    
    // Team Income: Sum of the daily_income of all active referred users' packages
    const teamUsers = users.filter(u => u.referredBy === userId && u.isActive);
    let teamIncomeToday = 0;
    teamUsers.forEach(u => {
      const p = PACKAGES[u.packageBought];
      if (p) {
        teamIncomeToday += p.daily_income;
      }
    });
    
    const totalToday = workIncomeToday + teamIncomeToday;
    const totalYesterday = totalToday; // Simulated
    const totalMonth = totalToday * 30; // Simulated
    const totalRevenue = totalMonth + totalYesterday; // Optional sum
    
    return {
      todayWorkIncome: workIncomeToday,
      todayTeamIncome: teamIncomeToday,
      totalToday,
      totalYesterday,
      totalMonth,
      totalRevenue
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f3f6fa] font-sans pb-4" dir={dir}>
      {/* Header */}
      <header className="bg-[#3a7af2] text-white flex items-center h-[50px] px-4 sticky top-0 z-50 shrink-0">
        <button onClick={() => navigate(-1)} className={`p-1 ${dir === 'ltr' ? '-ml-1' : '-mr-1'}`}>
          <ChevronRight size={26} strokeWidth={2} className={dir === 'ltr' ? 'rotate-180' : ''} />
        </button>
        <h1 className={`text-[17px] font-bold text-center flex-1 ${dir === 'ltr' ? 'mr-6' : 'ml-6'}`}>{t("تفاصيل الدخل")}</h1>
      </header>

      <div className="p-4 space-y-4">
        
        {/* Card 1 */}
        <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-4 pt-6 mt-1">
          <div className="text-center mb-6">
             <div className="text-gray-800 font-medium text-[15px] mb-1">{t("إجمالي الدخل اليوم")}</div>
             <div className="text-[#3a7af2] font-bold text-3xl font-mono">${totalToday.toFixed(2)}</div>
          </div>
          
          <div className="bg-[#f8fafd] border border-gray-50 rounded-[10px] flex items-center justify-between p-4">
             <div className={`flex-1 text-center ${dir === 'ltr' ? 'border-r pr-2' : 'border-l pl-2'} border-gray-100 last:border-0`}>
               <div className="text-gray-800 text-[14px] font-medium mb-2">{t("دخل العمل اليوم")}</div>
               <div className="text-[#3a7af2] font-semibold text-[15px] font-mono">${todayWorkIncome.toFixed(2)}</div>
             </div>
             <div className={`flex-1 text-center ${dir === 'ltr' ? 'pl-2' : 'pr-2'}`}>
               <div className="text-gray-800 text-[14px] font-medium mb-2">{t("دخل الفريق اليوم")}</div>
               <div className="text-[#3a7af2] font-semibold text-[15px] font-mono">${todayTeamIncome.toFixed(2)}</div>
             </div>
          </div>
        </div>
        
        {/* Card 2 */}
        <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-4 pb-8">
          <div className="bg-[#f8fafd] border border-gray-50 rounded-[10px] flex items-center justify-between p-4 mb-6">
             <div className={`flex-1 text-center ${dir === 'ltr' ? 'border-r pr-2' : 'border-l pl-2'} border-gray-100 last:border-0`}>
               <div className="text-gray-800 text-[14px] font-medium mb-2">{t("إجمالي الإيرادات أمس")}</div>
               <div className="text-[#3a7af2] font-semibold text-[15px] font-mono">${totalYesterday.toFixed(2)}</div>
             </div>
             <div className={`flex-1 text-center ${dir === 'ltr' ? 'pl-2' : 'pr-2'}`}>
               <div className="text-gray-800 text-[14px] font-medium mb-2">{t("إجمالي الدخل هذا الشهر")}</div>
               <div className="text-[#3a7af2] font-semibold text-[15px] font-mono">${totalMonth.toFixed(2)}</div>
             </div>
          </div>
          
          <div className="text-center">
             <div className="text-gray-800 font-medium text-[15px] mb-1">{t("إجمالي الإيرادات")}</div>
             <div className="text-[#3a7af2] font-bold text-3xl font-mono">${totalRevenue.toFixed(2)}</div>
          </div>
        </div>

      </div>
    </div>
  );
}
