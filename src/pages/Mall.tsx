import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, Wallet, CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";
import { useTranslation } from "../context/LanguageContext";
import { buyPackage, getUserBalance } from "../utils/user";
import { AnimatePresence, motion } from "motion/react";

const memberships = [
  { id: "ST-1", name: "ST-1", daily_income: 2.0, price: 50.0 },
  { id: "ST-2", name: "ST-2", daily_income: 6.0, price: 150.0 },
  { id: "ST-3", name: "ST-3", daily_income: 18.0, price: 450.0 },
  { id: "ST-4", name: "ST-4", daily_income: 60.0, price: 1440.0 },
  { id: "ST-5", name: "ST-5", daily_income: 150.0, price: 3600.0 },
  { id: "ST-6", name: "ST-6", daily_income: 360.0, price: 7200.0 },
  { id: "ST-7", name: "ST-7", daily_income: 720.0, price: 14400.0 },
];

export default function Mall() {
  const navigate = useNavigate();
  const { t, dir } = useTranslation();

  const [balance, setBalance] = useState<number>(0);
  const [userId, setUserId] = useState<string>("10001");
  const [selectedMembership, setSelectedMembership] = useState<typeof memberships[0] | null>(null);
  const [modalType, setModalType] = useState<"confirm" | "success" | "error" | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const uid = localStorage.getItem("userId") || "10001";
    setUserId(uid);
    setBalance(getUserBalance());
  }, []);

  const handleBuyClick = (membership: typeof memberships[0]) => {
    setSelectedMembership(membership);
    setModalType("confirm");
  };

  const confirmPurchase = () => {
    if (!selectedMembership) return;
    
    // Check local balance
    if (balance < selectedMembership.price) {
      setMessage(`رصيد المحفظة الخاص بك ($${balance.toFixed(2)}) غير كافٍ للاشتراك في الباقة ${selectedMembership.name}. السعر المطلوب هو ${selectedMembership.price}$!`);
      setModalType("error");
      return;
    }

    const res = buyPackage(userId, selectedMembership.id, selectedMembership.price);
    if (res.success) {
      setBalance(getUserBalance());
      setMessage(res.message);
      setModalType("success");
    } else {
      setMessage(res.message);
      setModalType("error");
    }
  };

  return (
    <div className="min-h-full bg-[#f3f6fa] font-sans pb-4" dir={dir}>
      {/* Header */}
      <header className="bg-[#3a7af2] text-white flex items-center justify-between h-[50px] px-4 sticky top-0 z-50 shadow-sm shrink-0">
        <button onClick={() => navigate(-1)} className="p-1 -mr-1">
          {dir === "rtl" ? <ChevronRight size={26} strokeWidth={2} /> : <ChevronLeft size={26} strokeWidth={2} />}
        </button>
        <h1 className="text-[17px] font-bold text-center flex-1">{t("انضم إلينا")}</h1>
        <button className="text-[14px] font-medium -ml-1 border border-white/25 px-2.5 py-1 rounded-full bg-white/5" onClick={() => navigate("/records")}>{t("السجلات")}</button>
      </header>


      {/* List */}
      <div className="p-3 mt-1 space-y-3" dir="ltr">
        {memberships.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center gap-3 border border-gray-50 border-b-gray-100"
          >
            {/* Left Icon (TikTok Splash) */}
            <div className="w-[48px] h-[48px] shrink-0 relative flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=120&q=80')] bg-cover bg-center rounded-full overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-[0.5px]"></div>
              {/* Faux TikTok logo */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="white"
                className="relative z-10 drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)]"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.68a6.34 6.34 0 0 0 6.26 6.36 6.35 6.35 0 0 0 6.25-6.36v-6.7a8.21 8.21 0 0 0 5.49 2V7.47a4.93 4.93 0 0 1-3.41-.78z" />
              </svg>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center" dir={dir}>
              {/* Top Row */}
              <div className="flex justify-between items-center pb-2 border-b border-gray-100 mb-2">
                <h3 className="text-[14.5px] text-gray-800 font-sans tracking-wide font-medium">
                  {m.name}
                </h3>
                <button 
                  onClick={() => handleBuyClick(m)}
                  className="bg-[#3a7af2] hover:bg-[#2f67ce] text-white px-4 py-1.5 rounded-[8px] text-[11.5px] font-bold min-w-[75px] shadow-sm active:scale-95 transition-transform cursor-pointer"
                >
                  {t("انضم إلينا")}
                </button>
              </div>

              {/* Bottom Row */}
              <div
                className="flex justify-between items-center text-[11px] text-gray-500 w-full"
                dir={dir}
              >
                <div className="flex gap-1 items-baseline shrink-0">
                  <span>{t("الدخل اليومي:")}</span>
                  <span
                    className="text-[#f16f2c] font-bold text-[13px]"
                    dir="ltr"
                  >
                    {m.daily_income.toFixed(2)}$
                  </span>
                </div>
                <div className="flex gap-1 items-baseline shrink-0">
                  <span>{t("كمية:")}</span>
                  <span
                    className="text-[#f16f2c] font-bold text-[13px]"
                    dir="ltr"
                  >
                    {m.price.toFixed(2)}$
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation/Alert Modals */}
      <AnimatePresence>
        {modalType && (
          <div className="fixed inset-0 bg-black/60 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-[340px] p-5 border border-gray-100 shadow-2xl text-center"
            >
              {modalType === "confirm" && selectedMembership && (
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-sky-50 rounded-full flex items-center justify-center text-[#3a7af2] mx-auto border border-sky-100">
                    <HelpCircle size={26} />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-extrabold text-slate-800 leading-snug">
                       تأكيد شراء الباقة {selectedMembership.name}
                    </h3>
                    <p className="text-[12px] text-gray-400 mt-2 leading-relaxed font-semibold">
                       هل أنت متأكد من رغبتك في الاشتراك بهذه الباقة؟ سيتم خصم <span className="text-[#f16f2c] font-bold">${selectedMembership.price}</span> من رصيد محفظتك المتاح وتحويله إلى رصيد العقد الخاص بك لتوليد مهام يومية.
                    </p>
                  </div>
                  <div className="flex gap-2.5 pt-2">
                    <button 
                      onClick={() => setModalType(null)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2 rounded-xl text-xs active:scale-95 transition-all cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button 
                      onClick={confirmPurchase}
                      className="flex-1 bg-[#3a7af2] hover:bg-[#2f67ce] text-white font-bold py-2 rounded-xl text-xs shadow-sm active:scale-95 transition-all cursor-pointer"
                    >
                      تأكيد الاشتراك
                    </button>
                  </div>
                </div>
              )}

              {modalType === "success" && (
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto border border-emerald-100">
                    <CheckCircle2 size={26} />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-extrabold text-slate-800 leading-snug">
                       تم تفعيل الاشتراك بنجاح!
                    </h3>
                    <p className="text-[12px] text-emerald-600 font-bold mt-2 leading-relaxed">
                       {message}
                    </p>
                  </div>
                  <div>
                    <button 
                      onClick={() => setModalType(null)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm active:scale-95 transition-all cursor-pointer"
                    >
                       موافق
                    </button>
                  </div>
                </div>
              )}

              {modalType === "error" && (
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 mx-auto border border-rose-100">
                    <AlertTriangle size={26} />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-extrabold text-slate-800 leading-snug">
                       رصيد غير كافٍ!
                    </h3>
                    <p className="text-[12.5px] text-rose-600 font-bold mt-2 leading-relaxed">
                       {message}
                    </p>
                  </div>
                  <div className="flex gap-2.5 pt-2">
                    <button 
                      onClick={() => setModalType(null)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2 rounded-xl text-xs active:scale-95 transition-all cursor-pointer"
                    >
                      إغلاق
                    </button>
                    <button 
                      onClick={() => {
                        setModalType(null);
                        navigate("/recharge");
                      }}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 rounded-xl text-xs shadow-sm active:scale-95 transition-all cursor-pointer"
                    >
                       شحن الرصيد
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
