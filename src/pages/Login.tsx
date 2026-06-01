import AuthLayout from "../components/AuthLayout";
import { Eye, EyeOff, Lock, AlertTriangle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "../context/LanguageContext";
import { supabase } from "../utils/supabase";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t, dir } = useTranslation();

  const handleLogin = async () => {
    if (!phone || !password) {
      setErrorMsg(t("الرجاء إدخال رقم الهاتف وكلمة المرور"));
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      // Simulate phone auth using dummy email format
      const email = `${phone}@app.local`;
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Obfuscate Supabase error messages
        setErrorMsg(t("حدث خطأ في تسجيل الدخول. تأكد من بياناتك."));
      } else if (data.user) {
        localStorage.setItem("userId", data.user.id);
        navigate("/home");
      }
    } catch (err) {
      setErrorMsg(t("حدث خطأ في الشبكة"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className={`space-y-4 ${dir === "rtl" ? "text-right" : "text-left"}`}>
        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-3 rounded-[6px] text-[13.5px] flex items-center gap-2">
            <AlertTriangle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Phone */}
        <div className="flex bg-white border border-[#e2eaf4] rounded-[6px] h-[46px] px-3 overflow-hidden items-center shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.01)] transition-colors focus-within:border-[#3a7af2]">
          <input
            type="text"
            className={`flex-1 outline-none text-[#5a6a85] text-[15px] font-sans font-bold ${dir === "rtl" ? "text-right" : "text-left"}`}
            placeholder={t("الرجاء إدخال رقم الهاتف")}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <span
            className="text-[#3b75df] font-bold text-[14px] ml-2 tracking-wide font-mono shrink-0"
            dir="ltr"
          >
            +963
          </span>
        </div>

        {/* Password */}
        <div className="flex bg-white border border-[#e2eaf4] rounded-[6px] h-[46px] px-3 overflow-hidden items-center shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.01)] transition-colors focus-within:border-[#3a7af2]">
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="focus:outline-none shrink-0"
          >
            {showPassword ? (
              <EyeOff size={18} className="text-[#a5b4ca] ml-2" />
            ) : (
              <Eye size={18} className="text-[#a5b4ca] ml-2" />
            )}
          </button>

          <input
            type={showPassword ? "text" : "password"}
            className={`flex-1 outline-none text-[#5a6a85] text-[15px] font-bold tracking-[0.1em] font-sans ${dir === "rtl" ? "text-right" : "text-left"} placeholder-translate-y-1`}
            placeholder={t(".الرجاء إدخال كلمة المرور الخاص بك")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Lock size={18} className="text-[#a5b4ca] mr-2 shrink-0" />
        </div>

        {/* Remember Me */}
        <div className="flex items-center pt-1 px-1 justify-start">
          <input
            type="checkbox"
            id="remember"
            defaultChecked
            className="w-[18px] h-[18px] text-[#3a7af2] bg-white border-[#e2eaf4] rounded focus:ring-[#3a7af2] accent-[#3a7af2] cursor-pointer"
          />
          <label
            htmlFor="remember"
            className="mr-2 text-[13.5px] text-[#7e8b9f] cursor-pointer font-medium px-1"
          >
            {t("تذكر كلمة مرور حسابك")}
          </label>
        </div>

        <div className="pt-4 pb-2">
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-[#367bf6] hover:bg-blue-600 disabled:opacity-75 transition-colors text-white rounded-[6px] h-[46px] font-bold text-[15px] shadow-md shadow-blue-500/10 active:scale-[0.98]"
          >
            {isLoading ? t("جاري التحميل...") : t("تسجيل الدخول الآن")}
          </button>
        </div>

        <div className="text-center pt-2">
          <Link
            to="/register"
            className="text-[#98a8c4] text-[13.5px] hover:text-[#7f90b2] transition-colors font-medium"
          >
            {t("ليس لديك حساب؟يسجل")}
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
