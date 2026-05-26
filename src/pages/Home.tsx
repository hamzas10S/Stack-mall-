import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const imgFashion = "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80";
const imgIllustration = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80";
const imgNeon = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80";
const imgElectronics = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80";

import Logo from "../components/Logo";
import { useTranslation } from "../context/LanguageContext";
import { productsData } from "../data/products";

const banners = [imgFashion, imgIllustration, imgNeon, imgElectronics];

export default function Home() {
  const navigate = useNavigate();
  const { t, language, dir } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [displayedProducts, setDisplayedProducts] = useState(
    productsData.slice(0, 8),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const pInterval = setInterval(() => {
      setDisplayedProducts((prev) => {
        const firstId = prev[0].id;
        const currentIndex = productsData.findIndex((p) => p.id === firstId);
        const nextIndex = (currentIndex + 8) % productsData.length;
        if (nextIndex + 8 > productsData.length) {
          return [
            ...productsData.slice(nextIndex),
            ...productsData.slice(0, 8 - (productsData.length - nextIndex)),
          ];
        }
        return productsData.slice(nextIndex, nextIndex + 8);
      });
    }, 10000); // 10 seconds
    return () => clearInterval(pInterval);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;

    // Swipe left (next slide in ltr, previous in rtl)
    if (distance > 50) {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }
    // Swipe right
    else if (distance < -50) {
      setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    }
    setTouchStart(null);
  };

  return (
    <div className="min-h-full bg-[#f3f6fa] font-sans pb-4" dir={dir}>
      {/* Header */}
      <header className="bg-[#3a7af2] text-white flex items-center justify-between h-[50px] px-4 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          {/* Custom logo */}
          <div className="flex items-center justify-center">
            <Logo width={30} color="#ffffff" className="!h-auto" />
          </div>
          <span className="font-semibold text-[13px] tracking-wide">Stack Mall</span>
        </div>
        {/* Languages Switch Indicator, clicking switches to language select screen */}
        <button
          onClick={() => navigate("/language")}
          className="flex items-center gap-1 text-[12.5px] font-bold bg-white/10 hover:bg-white/15 px-2.5 py-1.5 rounded-full transition-colors active:scale-95"
        >
          <span>{language === "ar" ? "عربي" : "English"}</span>
          <ChevronDown size={14} strokeWidth={2.5} />
        </button>
      </header>

      {/* Hero Banner */}
      <div
        className="w-full aspect-[21/9] bg-gray-200 relative overflow-hidden flex items-center shadow-sm bg-black"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {banners.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
              index === currentSlide
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <img
              src={img}
              alt={`Banner ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Semi-transparent dark overlay for high contrast */}
            <div className="absolute inset-0 bg-black/20" />
          </div>
        ))}

        {/* STACKMALL elegant brand overlay word */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 select-none">
          <div className="bg-black/30 backdrop-blur-sm border border-white/20 px-5 py-2 rounded-lg">
            <h2 className="text-white text-lg font-black tracking-[0.3em] font-sans drop-shadow-md text-center leading-none">
              STACKMALL
            </h2>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-[6px] h-[6px] rounded-full transition-all ${
                index === currentSlide
                  ? "bg-white shadow-sm scale-125"
                  : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-3 p-4 mt-2 bg-white">
        {/* Card 1: شراء الأسهم */}
        <button
          onClick={() => navigate("/shares")}
          className="bg-gradient-to-br from-[#e3f0ff] to-[#cbe4ff] rounded-[16px] p-3 relative overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.04)] h-[85px] flex flex-col items-start hover:opacity-90 transition-opacity"
        >
          <h3 className="text-[#3b84db] font-bold text-[12px] z-10 w-full mb-1 border-b border-blue-200/50 pb-1 inline-block text-right leading-none">
            {t("شراء الأسهم")}
          </h3>
          <p className="text-[#6495da] text-[9.5px] leading-tight font-medium z-10 max-w-[85%] text-right w-full">
            {t("المعلومات بديهية وسهلة التصفح")}
          </p>
          {/* Abstract Icon */}
          <div className="absolute bottom-1.5 left-1.5 opacity-70 transform rotate-12 scale-75">
            <div className="w-10 h-7 bg-[#3b84db] rounded flex items-center justify-center relative shadow-sm">
              <div className="w-3 h-3 bg-blue-300 rounded-full absolute -right-1 -top-1 border border-[#3b84db]"></div>
              <div className="w-2 h-1 bg-white rounded-full opacity-50"></div>
            </div>
          </div>
        </button>

        {/* Card 2: مقدمة عن الشركة */}
        <button
          onClick={() => navigate("/about")}
          className="bg-gradient-to-br from-[#fff2ea] to-[#ffd8c2] rounded-[16px] p-3 relative overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.04)] h-[85px] flex flex-col items-start hover:opacity-90 transition-opacity"
        >
          <h3 className="text-[#f1833c] font-bold text-[12px] z-10 w-full mb-1 border-b border-orange-200/50 pb-1 text-right leading-none">
            {t("مقدمة عن الشركة")}
          </h3>
          <p className="text-[#d8875a] text-[9.5px] leading-tight font-medium z-10 max-w-[85%] text-right w-full">
            {t("فريق متخصص في تكنولوجيا المعلومات")}
          </p>
          {/* Abstract Icon */}
          <div className="absolute bottom-1.5 left-1.5 opacity-70 transform -rotate-12 scale-75">
            <div className="w-8 h-8 bg-gradient-to-br from-[#f1833c] to-[#e66c25] rounded-md shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 transform rotate-45 scale-150 -translate-x-3"></div>
            </div>
          </div>
        </button>

        {/* Card 3: سعادة الفريق */}
        <button
          onClick={() => navigate("/rewards")}
          className="bg-gradient-to-br from-[#defcf1] to-[#baf3df] rounded-[16px] p-3 relative overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.04)] h-[85px] flex flex-col items-start hover:opacity-90 transition-opacity"
        >
          <h3 className="text-[#2aacc1] font-bold text-[12px] z-10 w-full mb-1 border-b border-teal-200/50 pb-1 text-right leading-none">
            {t("سعادة الفريق")}
          </h3>
          <p className="text-[#5da4b1] text-[9.5px] leading-tight font-medium z-10 max-w-[85%] text-right w-full">
            {t("تتراكم المكافآت وتستمر في القدوم!")}
          </p>
          {/* Abstract Icon */}
          <div className="absolute bottom-1.5 left-1.5 opacity-80 transform rotate-6 scale-75">
            <div className="flex items-end gap-0.5">
              <div className="w-2 h-3 bg-[#2aacc1] rounded-t-sm"></div>
              <div className="w-2 h-5 bg-[#2aacc1] rounded-t-sm"></div>
              <div className="w-2 h-7 bg-[#facc15] rounded-t-sm relative">
                <div className="absolute -top-1 -right-1 w-2 h-2 text-red-500">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </button>

        {/* Card 4: الاستيلاء على الطلبات */}
        <button
          onClick={() => navigate("/mall")}
          className="bg-gradient-to-br from-[#eadefc] to-[#d6c4fb] rounded-[16px] p-3 relative overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.04)] h-[85px] flex flex-col items-start hover:opacity-90 transition-opacity"
        >
          <h3 className="text-[#885fdd] font-bold text-[11px] z-10 w-full leading-none mb-1 border-b border-purple-200/50 pb-1 text-right">
            {t("الاستيلاء على الطلبات")}
          </h3>
          <p className="text-[#866dc0] text-[9.5px] leading-tight font-medium z-10 max-w-[85%] text-right w-full">
            {t("مهام حصرية عالية الجودة")}
          </p>
          {/* Abstract Icon */}
          <div className="absolute bottom-1.5 left-1.5 opacity-80 transform -rotate-12 scale-75">
            <div className="w-8 h-7 bg-[#885fdd] rounded-sm relative shadow-sm flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-green-400 border border-white absolute -bottom-1 -right-1 flex items-center justify-center text-white">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Product List */}
      <div className="px-3 pb-8 bg-[#f3f6fa] pt-4">
        <h3 className="font-bold text-[15px] text-[#2c3e50] mb-3 pr-2 border-r-4 border-[#3a7af2] leading-none">
          {t("قائمة المنتجات")}
        </h3>
        <div className="grid grid-cols-2 gap-x-2 gap-y-3">
          {displayedProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col border border-white/50"
            >
              {/* Image Container */}
              <div className="w-full aspect-square relative bg-white flex items-center justify-center border-b border-gray-50/50">
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-[85%] h-[85%] object-contain"
                />
                {p.id === 1 && (
                  <div className="absolute right-[15%] bottom-[15%] text-blue-500 opacity-80 backdrop-blur-md bg-blue-400/10 rounded-full p-2 border-2 border-blue-400/30">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                  </div>
                )}
              </div>

              <div className="p-2 pt-1 flex flex-col flex-1 pb-3">
                <div className="text-[#3b75df] font-bold text-[18px] text-center font-mono mt-1 mb-1 leading-none tracking-tight">
                  {p.price.toFixed(2)}
                </div>

                <div className="text-[#64748b] text-[10px] leading-tight text-center font-medium line-clamp-2 h-8 px-1">
                  {p.name}
                </div>

                <div className="mt-2 flex justify-between items-center text-[8.5px] text-[#94a3b8] px-1 font-bold">
                  <span className="font-mono pt-[1px]" dir="ltr">
                    {p.dropship}
                  </span>
                  <span>{t("كمية دروبشيبينغ المنتج")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
