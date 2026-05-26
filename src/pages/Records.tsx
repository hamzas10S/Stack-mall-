import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowDownLeft, ArrowUpRight, Clock, CheckCircle2, XCircle, Calendar, Landmark } from 'lucide-react';
import { getSimulatedTransactions, SimulatedTransaction } from '../utils/user';

export default function Records() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'recharge' | 'withdrawal'>('recharge');
  const [txs, setTxs] = useState<SimulatedTransaction[]>([]);
  const currentUserId = localStorage.getItem("userId") || "10001";

  useEffect(() => {
    // Only load transactions for the active user
    const allTxs = getSimulatedTransactions();
    const userTxs = allTxs.filter(tx => tx.userId === currentUserId);
    setTxs(userTxs);
  }, [currentUserId]);

  const handleBack = () => {
    navigate(-1);
    // Robusted back handler fallback to prevent broken navigation in empty sandboxed histories
    setTimeout(() => {
      if (window.location.pathname === '/records') {
        navigate('/profile');
      }
    }, 100);
  };

  const filteredTxs = txs.filter(t => {
    if (activeTab === 'recharge') {
      return t.type === 'deposit';
    } else {
      return t.type === 'withdraw';
    }
  });

  return (
    <div className="min-h-screen bg-[#f3f6fa] font-sans pb-10" dir="rtl">
      {/* Header */}
      <header className="bg-[#3a7af2] text-white pt-2 sticky top-0 z-50 shrink-0 shadow-md">
        <div className="flex items-center h-[50px] px-4">
          <button onClick={handleBack} className="p-1 -mr-1 cursor-pointer active:scale-95 transition-transform">
            <ChevronRight size={26} strokeWidth={2} />
          </button>
          <h1 className="text-[17px] font-bold text-center flex-1 pr-6">سِجِلّ المعاملات</h1>
        </div>
        
        {/* Tabs */}
        <div className="flex px-4 mt-1">
           <button 
             onClick={() => setActiveTab('recharge')}
             className={`flex-1 text-center py-3 text-[14px] font-bold relative transition-colors cursor-pointer ${
               activeTab === 'recharge' ? 'text-white' : 'text-blue-100/70 hover:text-white'
             }`}
           >
             سجل إعادة الشحن
             {activeTab === 'recharge' && (
               <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white rounded-t-sm"></div>
             )}
           </button>
           <button 
             onClick={() => setActiveTab('withdrawal')}
             className={`flex-1 text-center py-3 text-[14px] font-bold relative transition-colors cursor-pointer ${
               activeTab === 'withdrawal' ? 'text-white' : 'text-blue-100/70 hover:text-white'
             }`}
           >
             سجلات السحب
             {activeTab === 'withdrawal' && (
               <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white rounded-t-sm"></div>
             )}
           </button>
        </div>
      </header>

      {/* Content Area */}
      <div className="p-3.5 space-y-3">
        {filteredTxs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 px-4 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
            {/* Beautiful empty state graphic */}
            <div className="w-16 h-16 bg-slate-50 text-slate-350 rounded-full flex items-center justify-center mb-4 border border-slate-100 shadow-inner">
              <Landmark size={28} className="text-gray-400" />
            </div>
            <h3 className="text-[14px] font-bold text-slate-700">لا توجد سجلات حالياً</h3>
            <p className="text-[11px] text-gray-450 mt-1 max-w-[200px] leading-relaxed">
              لم تقم بأي عمليات {activeTab === 'recharge' ? 'إيداع أو شحن' : 'سحب أو تصفية'} رصيد في دورتك الحالية بعد.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredTxs.map((tx) => {
              const isDeposit = tx.type === 'deposit';
              
              // Status Styling Resolved
              let statusLabel = 'قيد الانتظار';
              let statusColorClass = 'bg-amber-50 text-amber-500 border-amber-100/40';
              let statusIcon = <Clock size={12} className="text-amber-500" />;
              
              if (tx.status === 'approved') {
                statusLabel = 'ناجح ✔️';
                statusColorClass = 'bg-emerald-50 text-emerald-600 border-emerald-100/40';
                statusIcon = <CheckCircle2 size={12} className="text-emerald-600" />;
              } else if (tx.status === 'rejected') {
                statusLabel = 'مرفوض ❌';
                statusColorClass = 'bg-rose-50 text-rose-500 border-rose-100/40';
                statusIcon = <XCircle size={12} className="text-rose-500" />;
              }

              return (
                <div 
                  key={tx.id}
                  className="bg-white rounded-xl p-3 border border-slate-100 shadow-xs flex items-center justify-between transition-all hover:border-slate-200"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Direction icon */}
                    <div className={`w-[42px] h-[42px] rounded-full shrink-0 flex items-center justify-center border ${
                      isDeposit 
                        ? 'bg-emerald-50/50 border-emerald-100/30 text-emerald-500' 
                        : 'bg-blue-50/50 border-blue-100/30 text-[#3a7af2]'
                    }`}>
                      {isDeposit ? <ArrowDownLeft size={20} strokeWidth={2.5} /> : <ArrowUpRight size={20} strokeWidth={2.5} />}
                    </div>

                    {/* Transaction info details */}
                    <div className="text-right flex-1 min-w-0 pr-0.5">
                      <div className="flex items-center gap-1.5 font-sans">
                        <span className="text-[13px] font-bold text-slate-800 leading-none">
                          {isDeposit ? 'عملية إيداع رصيد' : 'عملية سحب رصيد'}
                        </span>
                        <span className="text-[10px] bg-slate-50 text-slate-400 font-mono font-medium px-1.5 py-0.5 rounded border border-slate-100 leading-none">
                          {tx.network || 'BEP20'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 mt-1.5 text-gray-400 text-[10px] font-mono leading-none">
                        <Calendar size={10} className="text-gray-300" />
                        <span>{tx.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Left panel amount & status */}
                  <div className="text-left shrink-0 flex flex-col items-end gap-1.5 pl-0.5">
                    <span className={`text-[15px] font-bold font-mono tracking-tight leading-none ${
                      isDeposit ? 'text-emerald-500' : 'text-slate-800'
                    }`}>
                      {isDeposit ? `+$${tx.amount.toFixed(2)}` : `-$${tx.amount.toFixed(2)}`}
                    </span>
                    
                    {/* Status Pill Badge */}
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[9.5px] font-bold leading-none ${statusColorClass}`}>
                      {statusIcon}
                      <span>{statusLabel}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
