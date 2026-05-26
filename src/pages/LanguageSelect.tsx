import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { useTranslation } from "../context/LanguageContext";

export default function LanguageSelect() {
  const navigate = useNavigate();
  const { language, setLanguage, t, dir } = useTranslation();

  const handleSelect = (lang: "en" | "ar") => {
    setLanguage(lang);
  };

  return (
    <div className="min-h-screen bg-[#f3f6fa] font-sans flex flex-col max-w-md mx-auto relative shadow-xl" dir={dir}>
      {/* Header */}
      <header className="bg-[#3a7af2] text-white flex items-center justify-between h-[50px] px-4 sticky top-0 z-50 shadow-sm shrink-0">
        <button onClick={() => navigate(-1)} className="p-1 -mr-1">
          {dir === "rtl" ? <ChevronRight size={26} strokeWidth={2} /> : <ChevronLeft size={26} strokeWidth={2} />}
        </button>
        <h1 className="text-[17px] font-bold text-center flex-1">
          {t("اختيار اللغة")}
        </h1>
        <div className="w-[30px]" /> {/* Spacer to balance back button */}
      </header>

      {/* Language List */}
      <div className="p-4 flex-1">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
          {/* English option */}
          <button
            onClick={() => handleSelect("en")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors text-right"
            style={{ direction: "ltr" }}
          >
            <span className="text-[15px] font-medium text-gray-800">English</span>
            {language === "en" && (
              <Check size={20} className="text-[#3a7af2] shrink-0" strokeWidth={3} />
            )}
          </button>

          {/* Arabic option */}
          <button
            onClick={() => handleSelect("ar")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors text-right"
            style={{ direction: "rtl" }}
          >
            <span className="text-[15px] font-medium text-gray-800">عربي</span>
            {language === "ar" && (
              <Check size={20} className="text-[#3a7af2] shrink-0" strokeWidth={3} />
            )}
          </button>
        </div>
      </div>


    </div>
  );
}
