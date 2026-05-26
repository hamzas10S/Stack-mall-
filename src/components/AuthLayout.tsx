import React from "react";
import { Headset } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useTranslation } from "../context/LanguageContext";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { t, dir } = useTranslation();

  return (
    <div
      className="min-h-screen bg-[#f3f6fa] flex flex-col font-sans relative"
      dir={dir}
    >
      {/* Top Background */}
      <div className="h-[180px] bg-gradient-to-b from-[#0e1628] via-[#101b36] to-[#14234b] relative overflow-hidden">
        {/* Stars background - simplified using CSS radial gradients */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-screen"
          style={{
            backgroundImage: `
                 radial-gradient(1.5px 1.5px at 20% 30%, #fff, rgba(0,0,0,0)),
                 radial-gradient(2px 2px at 40% 70%, #fff, rgba(0,0,0,0)),
                 radial-gradient(1.5px 1.5px at 60% 20%, #fff, rgba(0,0,0,0)),
                 radial-gradient(2px 2px at 80% 50%, #fff, rgba(0,0,0,0)),
                 radial-gradient(1.5px 1.5px at 90% 80%, #fff, rgba(0,0,0,0)),
                 radial-gradient(2.5px 2px at 10% 90%, #fff, rgba(0,0,0,0)),
                 radial-gradient(1.5px 1.5px at 50% 50%, #fff, rgba(0,0,0,0)),
                 radial-gradient(2px 2px at 70% 10%, #fff, rgba(0,0,0,0))
               `,
            backgroundSize: "150px 150px",
          }}
        ></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "linear-gradient(0deg, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "50px 70px",
          }}
        ></div>

        {/* Top Nav */}
        <div className="flex justify-between items-center px-4 pt-4 relative z-20">
          <div className="text-[#fad7b0] relative cursor-pointer" onClick={() => navigate("/help")}>
            <Headset size={26} strokeWidth={2.5} />
            <div className="w-[4px] h-[4px] bg-[#fad7b0] rounded-full absolute bottom-1 right-1"></div>
          </div>
          <button
            onClick={() => navigate("/language")}
            className="text-white text-[13.5px] font-bold bg-white/10 hover:bg-white/15 px-3 py-1 rounded-full transition-all active:scale-95"
          >
            {t("اختيار اللغة")}
          </button>
        </div>

        {/* Logo */}
        <div className="relative z-20 flex justify-center mt-3">
          <div className="bg-white w-[86px] h-[86px] rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.12)] flex items-center justify-center">
            <Logo width={56} />
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-[#f3f6fa] -mt-10 rounded-t-[2.5rem] relative z-10 px-6 pt-6 pb-20 shadow-[0_-8px_20px_rgba(0,0,0,0.04)] w-full max-w-[390px] mx-auto min-h-[calc(100vh-160px)]">
        {children}
      </div>


    </div>
  );
}
