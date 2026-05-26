import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, Users, Monitor, FileText, User } from "lucide-react";
import clsx from "clsx";
import { useTranslation } from "../context/LanguageContext";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, dir } = useTranslation();

  const tabs = [
    { id: "home", icon: Home, label: "بيت", path: "/home" },
    { id: "responsible", icon: Users, label: "الشخص المسؤول", path: "/team" },
    { id: "work", icon: Monitor, label: "طاولة العمل", path: "/vip" },
    { id: "join", icon: FileText, label: "انضم إلينا", path: "/mall" },
    { id: "profile", icon: User, label: "ملكي", path: "/profile" },
  ];

  return (
    <div
      className="flex flex-col h-[100dvh] overflow-hidden bg-[#f3f6fa] max-w-md mx-auto relative shadow-xl font-sans"
      dir={dir}
    >
      <div className="flex-1 overflow-y-auto pb-[20px]">
        <Outlet />
      </div>

      <div className="shrink-0 w-full bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] border-t border-gray-100 flex justify-around items-center z-50 h-[56px] pb-safe-bottom relative">
        {tabs.map((tab) => {
          const isActive = location.pathname.startsWith(tab.path);
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors"
            >
              <Icon
                size={20}
                className={clsx(isActive ? "text-[#3a7af2]" : "text-[#a5b4ca]")}
                strokeWidth={isActive ? 2.5 : 2}
                fill={isActive ? "#3a7af2" : "none"}
                fillOpacity={0.1}
              />
              <span
                className={clsx(
                  "text-[9px] font-bold mt-1",
                  isActive ? "text-[#3a7af2]" : "text-[#a5b4ca]",
                )}
              >
                {t(tab.label)}
              </span>
            </button>
          );
        })}
      </div>


    </div>
  );
}
