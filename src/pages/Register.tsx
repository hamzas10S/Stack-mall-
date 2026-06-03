import AuthLayout from "../components/AuthLayout";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { addSimulatedReferral, registerSimulatedUser } from "../utils/user";
import { useTranslation } from "../context/LanguageContext";
import { supabase } from "../utils/supabase";

interface CaptchaChar {
  char: string;
  rotation: string;
  yOffset: string;
  fontSize: string;
  color: string;
  weight: string;
}

const generateCaptcha = (): CaptchaChar[] => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const colors = [
    "text-amber-900",
    "text-rose-900",
    "text-emerald-900",
    "text-indigo-900",
    "text-teal-900",
    "text-slate-900",
    "text-blue-900",
    "text-violet-900"
  ];
  const rot = [
    "-rotate-12", "rotate-12", "-rotate-[15deg]", "rotate-[15deg]",
    "-rotate-6", "rotate-6", "-rotate-3", "rotate-3"
  ];
  const yOff = [
    "-translate-y-2", "translate-y-2", "-translate-y-1.5", "translate-y-1.5",
    "-translate-y-1", "translate-y-1", "-translate-y-0.5", "translate-y-0.5"
  ];
  const sizes = ["text-[13px]", "text-[14px]", "text-[15px]", "text-[16px]", "text-[17px]"];
  
  const result: CaptchaChar[] = [];
  for (let i = 0; i < 4; i++) {
    const randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
    result.push({
      char: randomChar,
      rotation: rot[Math.floor(Math.random() * rot.length)],
      yOffset: yOff[Math.floor(Math.random() * yOff.length)],
      fontSize: sizes[Math.floor(Math.random() * sizes.length)],
      color: colors[Math.floor(Math.random() * colors.length)] || "text-slate-800",
      weight: Math.random() > 0.4 ? "font-bold" : "font-extrabold"
    });
  }
  return result;
};

export default function Register() {
  const navigate = useNavigate();
  const { t, dir } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPayPassword, setShowPayPassword] = useState(false);

  const [searchParams] = useSearchParams();
  const [inviteCode, setInviteCode] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [payPassword, setPayPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [validationError, setValidationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [captchaChars, setCaptchaChars] = useState<CaptchaChar[]>([]);

  const refreshCaptcha = () => {
    setCaptchaChars(generateCaptcha());
  };

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "", color: "", textColor: "" };

    if (pass.length < 6) {
      return {
        score: 1,
        label: t("ضعيف"),
        color: "bg-[#e11d48]",
        textColor: "text-[#e11d48]",
      };
    }

    if (pass.length < 8) {
      return {
        score: 2,
        label: t("متوسط"),
        color: "bg-[#f59e0b]",
        textColor: "text-[#f59e0b]",
      };
    }

    return {
      score: 3,
      label: t("قوي جداً"),
      color: "bg-[#10b981]",
      textColor: "text-[#10b981]",
    };
  };

  const strength = getPasswordStrength(password);

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      setInviteCode(ref);
    }
  }, [searchParams]);

  useEffect(() => {
    refreshCaptcha();
    const interval = setInterval(() => {
      refreshCaptcha();
    }, 60000); // changes every 1 minute
    return () => clearInterval(interval);
  }, []);

  const handleRegister = async () => {
    const newErrors: Record<string, boolean> = {};
    
    if (!phone.trim()) newErrors.phone = true;
    if (!email.trim()) newErrors.email = true;
    if (!captcha.trim()) newErrors.captcha = true;
    if (!password) newErrors.password = true;
    if (!confirmPassword) newErrors.confirmPassword = true;
    if (!payPassword) newErrors.payPassword = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setValidationError("الرجاء ملء جميع الحقول المطلوبة المميزة باللون الأحمر!");
      refreshCaptcha();
      return;
    }

    const expectedText = captchaChars.map(c => c.char).join("").toLowerCase();
    if (captcha.trim().toLowerCase() !== expectedText) {
      setErrors({ captcha: true });
      setValidationError("رمز التحقق غير صحيح!");
      setCaptcha("");
      refreshCaptcha();
      return;
    }

    if (password !== confirmPassword) {
      setErrors({ password: true, confirmPassword: true });
      setValidationError("كلمات المرور غير متطابقة!");
      refreshCaptcha();
      return;
    }

    setErrors({});
    setValidationError("");
    setIsLoading(true);

    try {
      const emailObj = email || `${phone}@app.local`; // Use actual email if provided, fallback to dummy
      
      const timeoutPromise = new Promise<{data: any, error: any}>((_, reject) => {
        setTimeout(() => reject(new Error("Network Timeout")), 15000);
      });

      const { data, error } = await Promise.race([
        supabase.auth.signUp({
          email: emailObj,
          password: password,
        }),
        timeoutPromise
      ]) as any;

      if (error) {
        setValidationError("حدث خطأ في التسجيل: " + (error.message || "قد يكون الحساب موجوداً."));
        refreshCaptcha();
      } else if (data?.user) {
        // Upsert with explicit onConflict to avoid duplicate key errors if a trigger already created the row.
        const { error: insErr } = await Promise.race([
          supabase.from('app_users').upsert({
            id: data.user.id,
            email: emailObj,
            phone: phone,
            referred_by: inviteCode || null,
            reg_date: new Date().toISOString().split("T")[0]
          }, { onConflict: 'id' }),
          timeoutPromise
        ]) as any;

        if (insErr && !insErr.message?.includes('duplicate key') && !insErr.message?.includes('row-level security')) {
            console.error("Supabase insert error:", insErr);
            setValidationError("عطل في عملية إنشاء الحساب. تأكد من الإعدادات." + (!data.session ? " (رجاء إيقاف Confirm Email في Supabase)" : ""));
            refreshCaptcha();
            setIsLoading(false);
            return;
        }
        
        // Securely set the transaction password using an RPC instead of plain-text INSERT
        try {
          await Promise.race([
            supabase.rpc('change_transaction_password', {
                new_password: payPassword
            }),
            timeoutPromise
          ]);
        } catch(rpcErr) {
          console.error("RPC Error:", rpcErr);
        }

        await registerSimulatedUser(emailObj, phone, inviteCode || undefined, data.user.id);
        if (inviteCode) {
          addSimulatedReferral();
        }
        localStorage.setItem("userId", data.user.id);
        navigate("/home");
      }
    } catch(err: any) {
      console.error(err);
      if (err.message === "Network Timeout") {
         setValidationError("انتهى وقت الاتصال. يبدو أن هناك مشكلة في الشبكة، برجاء استخدام VPN أو التأكد من اتصالك.");
      } else {
         setValidationError("حدث خطأ في الشبكة أو تعذر الاتصال بالخادم.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (field: string, val: string, setter: (val: string) => void) => {
    setter(val);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  return (
    <AuthLayout>
      <div className={`space-y-[6px] ${dir === "rtl" ? "text-right" : "text-left"}`}>
        {validationError && (
          <div className="bg-rose-50 text-rose-600 border border-rose-100 p-2 rounded-md text-[11px] font-bold text-center">
            {validationError}
          </div>
        )}

        {/* Phone */}
        <div className={`flex bg-white border ${errors.phone ? "border-rose-500 ring-1 ring-rose-200" : "border-[#e2eaf4] focus-within:border-[#3a7af2]"} rounded-[6px] h-[37px] px-3 overflow-hidden items-center shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.01)] transition-colors`}>
          <input
            type="text"
            placeholder={t("الرجاء إدخال رقم الهاتف")}
            value={phone}
            onChange={(e) => handleFieldChange("phone", e.target.value, setPhone)}
            className={`flex-1 outline-none text-[#5a6a85] text-[12px] font-sans ${dir === "rtl" ? "text-right" : "text-left"} placeholder:text-[#a5b4ca]`}
          />
          <span
            className="text-[#3b75df] font-bold text-[12.5px] ml-2 tracking-wide font-mono shrink-0"
            dir="ltr"
          >
            +963
          </span>
        </div>

        {/* Email */}
        <div className={`flex bg-white border ${errors.email ? "border-rose-500 ring-1 ring-rose-200" : "border-[#e2eaf4] focus-within:border-[#3a7af2]"} rounded-[6px] h-[37px] px-3 overflow-hidden items-center shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.01)] transition-colors`}>
          <input
            type="email"
            placeholder={t("الرجاء إدخال البريد الإلكتروني")}
            value={email}
            onChange={(e) => handleFieldChange("email", e.target.value, setEmail)}
            className={`flex-1 outline-none text-[#5a6a85] text-[12px] font-sans ${dir === "rtl" ? "text-right" : "text-left"} placeholder:text-[#a5b4ca]`}
          />
        </div>

        {/* Captcha */}
        <div className={`flex bg-white border ${errors.captcha ? "border-rose-500 ring-1 ring-rose-200" : "border-[#e2eaf4] focus-within:border-[#3a7af2]"} rounded-[6px] h-[37px] px-3 overflow-hidden items-center shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.01)] transition-colors`}>
          <input
            type="text"
            placeholder={t("الرجاء إدخال رمز التحقق")}
            value={captcha}
            onChange={(e) => handleFieldChange("captcha", e.target.value, setCaptcha)}
            className={`flex-1 outline-none text-[#5a6a85] text-[12px] font-sans ${dir === "rtl" ? "text-right" : "text-left"} placeholder:text-[#a5b4ca]`}
          />
          <div 
            onClick={refreshCaptcha}
            title={t("اضغط لتحديث رمز التحقق")}
            className="w-[95px] h-[28px] bg-gradient-to-r from-[#eef2f6] to-[#f4f7fa] mr-2 ml-[-4px] overflow-hidden relative flex items-center justify-center opacity-95 rounded-[4px] border border-[#e4ecf3] cursor-pointer select-none"
          >
            {/* Fake noise pattern and diagonal lines */}
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(#475569 1.2px, transparent 1.2px)",
                backgroundSize: "6px 6px",
              }}
            ></div>
            {/* Wave noise line */}
            <div className="absolute left-0 right-0 h-[1.5px] bg-[#94a3b8] opacity-50 rotate-3 top-[43%] pointer-events-none"></div>
            <div className="absolute left-0 right-0 h-[1.5px] bg-[#64748b] opacity-40 -rotate-6 top-[55%] pointer-events-none"></div>

            <div className="flex gap-1 items-center justify-center relative z-10" dir="ltr">
              {captchaChars.map((charObj, index) => (
                <span
                  key={index}
                  className={`inline-block select-none transform ${charObj.color} ${charObj.fontSize} ${charObj.rotation} ${charObj.yOffset} ${charObj.weight} tracking-normal drop-shadow-sm font-sans`}
                >
                  {charObj.char}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Password */}
        <div className={`flex bg-white border ${errors.password ? "border-rose-500 ring-1 ring-rose-200" : "border-[#e2eaf4] focus-within:border-[#3a7af2]"} rounded-[6px] h-[37px] px-3 overflow-hidden items-center shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.01)] transition-colors`}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder={t("الرجاء إدخال كلمة المرور الخاصة بك")}
            value={password}
            onChange={(e) => handleFieldChange("password", e.target.value, setPassword)}
            className={`flex-1 outline-none text-[#5a6a85] text-[12px] ${dir === "rtl" ? "text-right" : "text-left"} placeholder:text-[#a5b4ca]`}
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="focus:outline-none"
            type="button"
          >
            {showPassword ? (
              <EyeOff size={14} className="text-[#a5b4ca] mr-2 shrink-0" />
            ) : (
              <Eye size={14} className="text-[#a5b4ca] mr-2 shrink-0" />
            )}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {password && (
          <div className="pt-0.5 px-1 pb-0.5" dir={dir}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[9.5px] text-[#7e8b9f]">
                {t("مستوى قوة كلمة المرور:")}
              </span>
              <span className={`text-[10px] font-bold ${strength.textColor}`}>
                {strength.label}
              </span>
            </div>
            <div className="flex gap-1 h-[3px]">
              <div
                className={`h-full flex-1 rounded-full transition-all duration-300 ${strength.score >= 1 ? strength.color : "bg-[#e2eaf4]"}`}
              ></div>
              <div
                className={`h-full flex-1 rounded-full transition-all duration-300 ${strength.score >= 2 ? strength.color : "bg-[#e2eaf4]"}`}
              ></div>
              <div
                className={`h-full flex-1 rounded-full transition-all duration-300 ${strength.score >= 3 ? strength.color : "bg-[#e2eaf4]"}`}
              ></div>
            </div>
          </div>
        )}

        {/* Confirm Password */}
        <div className={`flex bg-white border ${errors.confirmPassword ? "border-rose-500 ring-1 ring-rose-200" : "border-[#e2eaf4] focus-within:border-[#3a7af2]"} rounded-[6px] h-[37px] px-3 overflow-hidden items-center shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.01)] transition-colors`}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder={t("يرجى تأكيد كلمة المرور الخاصة بك")}
            value={confirmPassword}
            onChange={(e) => handleFieldChange("confirmPassword", e.target.value, setConfirmPassword)}
            className={`flex-1 outline-none text-[#5a6a85] text-[12px] ${dir === "rtl" ? "text-right" : "text-left"} placeholder:text-[#a5b4ca]`}
          />
          <button
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="focus:outline-none"
            type="button"
          >
            {showConfirmPassword ? (
              <EyeOff size={14} className="text-[#a5b4ca] mr-2 shrink-0" />
            ) : (
              <Eye size={14} className="text-[#a5b4ca] mr-2 shrink-0" />
            )}
          </button>
        </div>

        {/* Payment Password */}
        <div className={`flex bg-white border ${errors.payPassword ? "border-rose-500 ring-1 ring-rose-200" : "border-[#e2eaf4] focus-within:border-[#3a7af2]"} rounded-[6px] h-[37px] px-3 overflow-hidden items-center shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.01)] transition-colors`}>
          <input
            type={showPayPassword ? "text" : "password"}
            placeholder={t("رجاء إدخال كلمة المرور الخاصة بك المكونة من 6 أرقام")}
            value={payPassword}
            onChange={(e) => handleFieldChange("payPassword", e.target.value, setPayPassword)}
            className={`flex-1 outline-none text-[#5a6a85] text-[11.5px] ${dir === "rtl" ? "text-right" : "text-left"} placeholder:text-[#a5b4ca] tracking-tight`}
          />
          <button
            onClick={() => setShowPayPassword(!showPayPassword)}
            className="focus:outline-none"
            type="button"
          >
            {showPayPassword ? (
              <EyeOff size={14} className="text-[#a5b4ca] mr-2 shrink-0" />
            ) : (
              <Eye size={14} className="text-[#a5b4ca] mr-2 shrink-0" />
            )}
          </button>
        </div>

        {/* Invite Code */}
        <div className="flex bg-white border border-[#e2eaf4] rounded-[6px] h-[37px] px-3 overflow-hidden items-center shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.01)] transition-colors focus-within:border-[#3a7af2]">
          <input
            type="text"
            placeholder={t("الرجاء إدخال رمز الدعوة (اختياري)")}
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            className={`flex-1 outline-none text-[#5a6a85] text-[12px] ${dir === "rtl" ? "text-right" : "text-left"} placeholder:text-[#a5b4ca]`}
          />
        </div>

        <div className="pt-1 space-y-1.55">
          <button
            onClick={handleRegister}
            disabled={isLoading}
            className="w-full bg-[#367bf6] hover:bg-blue-600 disabled:opacity-75 transition-colors text-white rounded-[6px] h-[37px] font-bold text-[13.5px] tracking-wide shadow-md shadow-blue-500/10 active:scale-[0.98]"
          >
            {isLoading ? t("جاري التحميل...") : t("سجل الآن")}
          </button>

          <button className="w-full mt-1.5 bg-[#ecf3fe] border border-[#a6c7f4] text-[#4281ee] hover:bg-[#e1ecfe] transition-colors rounded-[6px] h-[37px] font-bold text-[13.5px] active:scale-[0.98]">
            {t("Download APP")}
          </button>
        </div>

        <div className="text-center pt-1" style={{ direction: dir }}>
          <Link
            to="/login"
            className="text-[#98a8c4] text-[11.5px] hover:text-[#7f90b2] transition-colors font-medium"
          >
            {t("هل لديك حساب بالفعل؟ قم بتسجيل الدخول")}
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
