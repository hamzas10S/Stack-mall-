import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Power,
  Download,
  HelpCircle,
  Lock,
  FileText,
  Gift,
  Send,
  User,
} from "lucide-react";
import { getUserInfo, getUserBalance, getUserContractBalance } from "../utils/user";
import { supabase } from "../utils/supabase";
import { useTranslation } from "../context/LanguageContext";

export default function Profile() {
  const navigate = useNavigate();
  const userInfo = getUserInfo();
  const balance = getUserBalance();
  const contractBalance = getUserContractBalance();
  const { t, dir } = useTranslation();

  return (
    <div className="min-h-full bg-[#f3f6fa] font-sans pb-10" dir={dir}>
      {/* Header Profile */}
      <div className="bg-gradient-to-b from-[#55a6ff] to-[#245ce0] text-white pt-6 pb-20 px-4 relative rounded-b-[24px]">
        {/* Top bar */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-[48px] h-[48px] rounded-full relative bg-[url('https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=120&q=80')] bg-cover bg-center border-2 border-white/50 overflow-hidden shadow-md">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
              {/* TikTok logo visual */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.68a6.34 6.34 0 0 0 6.26 6.36 6.35 6.35 0 0 0 6.25-6.36v-6.7a8.21 8.21 0 0 0 5.49 2V7.47a4.93 4.93 0 0 1-3.41-.78z" />
                </svg>
               </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[16px] font-bold tracking-wide">
                  {userInfo.id}
                </span>
                {userInfo.isExpired && (
                  <span className="bg-red-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                    {t("منتهي الصلاحية")}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button className="bg-white text-gray-800 text-[12px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm mt-1.5 active:scale-95 transition-transform">
            <User size={12} className="text-[#f18e38]" />
            {t("موضع")}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-3 -mt-12 relative z-10 space-y-2">
        {/* Account Info Card */}
        <div className="bg-white rounded-xl shadow-sm p-4 relative overflow-hidden flex flex-col justify-between min-h-[120px]">
          <div className="flex justify-between items-center mb-3">
            <div className="flex-1 text-center border-l border-gray-100">
              <div className="text-gray-600 text-[12.5px] font-medium mb-1">
                {t("رصيد الحساب")}
              </div>
              <div className="text-[#3a7af2] text-[22px] font-bold font-mono">
                {balance.toFixed(2)}
              </div>
            </div>
            <div className="flex-1 text-center">
              <div className="text-gray-600 text-[12.5px] font-medium mb-1">
                {t("مبلغ العقد المتاح")}
              </div>
              <div className="text-[#3a7af2] text-[22px] font-bold font-mono">
                {contractBalance.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center bg-white border-t border-gray-50 pt-3">
            <div className="text-gray-500 text-[12px]">
              {t("البريد الإلكتروني للشركة:")}
            </div>
            <button className="bg-[#6db5f1] hover:bg-[#5aa4e0] text-white px-3 py-1.5 rounded-full text-[12px] font-medium flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform" onClick={() => navigate("/help")}>
              <Send size={12} className="transform -rotate-44" />
              {t("خدمة العملاء")}
            </button>
          </div>
        </div>

        {/* 2 Banner Cards */}
        <div className="grid grid-cols-2 gap-2">
          {/* Fund Details */}
          <button
            onClick={() => navigate("/income")}
            className="bg-gradient-to-br from-[#80ecc5] to-[#4dc1a1] rounded-[10px] p-2 shadow-sm relative overflow-hidden h-[55px] text-right active:scale-95 transition-transform"
          >
            <h3 className="text-white text-[11.5px] font-bold relative z-10 w-[55px] leading-tight">
              {t("تفاصيل الصندوق")}
            </h3>

            {/* Visual elements box pointing up */}
            <div className="absolute left-0 bottom-0 opacity-90 right-auto w-[40px] h-[40px] translate-y-1 scale-90">
              <div className="absolute bottom-0 text-[30px]">📦</div>
              <svg
                viewBox="0 0 24 24"
                fill="white"
                className="absolute top-1 right-2 w-4 h-4 opacity-80"
              >
                <path d="M12 4l-8 8h6v8h4v-8h6L12 4z" />
              </svg>
            </div>
          </button>

          {/* Income Details */}
          <button
            onClick={() => navigate("/income")}
            className="bg-gradient-to-br from-[#b196f7] to-[#8d69f1] rounded-[10px] p-2 shadow-sm relative overflow-hidden h-[55px] text-right active:scale-95 transition-transform"
          >
            <h3 className="text-white text-[11.5px] font-bold relative z-10 w-[55px] leading-tight">
              {t("تفاصيل الدخل")}
            </h3>

            {/* Visual elements folder coins */}
            <div className="absolute left-0 bottom-0 opacity-90 right-auto w-[40px] h-[40px] translate-y-2 scale-90">
              <div className="absolute bottom-1 right-1 text-[24px]">📁</div>
              <div className="absolute bottom-2 left-0 text-[12px]">🪙</div>
              <div className="absolute top-1 left-2 text-[9px]">🪙</div>
            </div>
          </button>
        </div>

        {/* Recharge and Withdraw */}
        <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] grid grid-cols-2 divide-x divide-x-reverse divide-gray-100 overflow-hidden">
          <button
            onClick={() => navigate("/recharge")}
            className="p-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-[#333] text-[12px] font-bold">
                {t("إعادة التعبئة")}
              </span>
              <span className="text-gray-400 text-[9px]">{t("اكسب عمولة")}</span>
            </div>
            <div className="bg-[#ffdbd6] p-1.5 rounded-md min-w-[24px] flex justify-center items-center">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f65e49"
                strokeWidth="2.5"
              >
                <path d="M4 10h12" />
                <path d="M4 14h8" />
                <path d="M3 6h18v12H3z" />
                <path d="M14 6v12" />
              </svg>
            </div>
          </button>

          <button
            onClick={() => navigate("/withdraw")}
            className="p-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-[#333] text-[12px] font-bold">
                {t("انسحاب")}
              </span>
              <span className="text-gray-400 text-[9px]">{t("الدفع الفوري")}</span>
            </div>
            <div className="bg-[#ccf1e5] p-1.5 rounded-md min-w-[24px] flex justify-center items-center">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#12a87c"
                strokeWidth="2.5"
              >
                <path d="M4 14h4" />
                <path d="M10 14h6" />
                <path d="M3 6h18v12H3z" />
                <path d="M10 6v12" />
                <path d="M12 14l-2 2 2 2" />
              </svg>
            </div>
          </button>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
          <MenuItem
            icon={<Gift size={14} className="text-[#ff7f41]" />}
            label={t("صندوق هدايا")}
            onClick={() => navigate("/rewards")}
            dir={dir}
          />
          <MenuItem
            icon={<FileText size={14} className="text-[#51cd98]" />}
            label={t("سجلات الحسابات")}
            onClick={() => navigate("/records")}
            dir={dir}
          />
          <MenuItem
            icon={<Lock size={14} className="text-[#41bee9]" />}
            label={t("تغيير كلمة المرور")}
            onClick={() => navigate("/settings/password/login")}
            dir={dir}
          />
          <MenuItem
            icon={<Lock size={14} className="text-[#a55deb]" />}
            label={t("تغيير كلمة المرور للصناديق")}
            onClick={() => navigate("/settings/password/payment")}
            dir={dir}
          />
          <MenuItem
            icon={<HelpCircle size={14} className="text-[#4581f1]" />}
            label={t("مركز المساعدة")}
            onClick={() => navigate("/help")}
            dir={dir}
          />
          <MenuItem
            icon={<Download size={14} className="text-[#ff5588]" />}
            label={t("تنزيل التطبيق")}
            onClick={() => {}}
            dir={dir}
          />
          <MenuItem
            icon={<Power size={14} className="text-[#fc6e36]" />}
            label={t("تسجيل الخروج")}
            onClick={async () => {
              await supabase.auth.signOut();
              localStorage.removeItem("userId");
              navigate("/login");
            }}
            hasBorder={false}
            dir={dir}
          />
        </div>
      </div>
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  hasBorder = true,
  dir = "rtl"
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  hasBorder?: boolean;
  dir?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors ${hasBorder ? "border-b border-gray-100" : ""}`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-gray-800 text-[14px] font-medium">{label}</span>
      </div>
      <div className="text-gray-300">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={dir === "ltr" ? "rotate-180" : ""}
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </div>
    </button>
  );
}
