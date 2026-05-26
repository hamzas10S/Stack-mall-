import Header from '../components/Header';
import { Globe, Info, Handshake, Truck, ShieldCheck, TrendingUp, Calendar, Smartphone } from 'lucide-react';
import clsx from 'clsx';

const menuItems = [
  { icon: Globe, title: 'موقع الشركة', path: '/about' },
  { icon: Info, title: 'خصية عمل Stack Mall', path: '#' },
  { icon: Handshake, title: 'ربح الشريك', path: '#' },
  { icon: Truck, title: 'بخصوص الشحن المباشر', path: '#' },
  { icon: ShieldCheck, title: 'ضمان شريك Stack Mall', path: '#' },
  { icon: TrendingUp, title: 'خطة التطوير الوظيفي', path: '#' },
  { icon: Calendar, title: 'خطة المزايا لعام 2026', path: '#' },
  { icon: Smartphone, title: 'لتطام Stack Mall تنزيل تطبيق Android', path: '#' },
  { icon: Smartphone, title: 'الخاص بك على iPhone قم بتنزيل تطبيق Stack Mall', path: '#' }
];

export default function Help() {
  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <Header title="مركز المساعدة" bgClass="bg-header-gradient" />
      
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === menuItems.length - 1;
            return (
              <a 
                key={index}
                href={item.path}
                className={clsx(
                  "flex items-center p-4 hover:bg-slate-50 transition-colors",
                  !isLast && "border-b border-slate-100"
                )}
              >
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0 ml-3">
                  <Icon size={18} />
                </div>
                <div className="flex-1 font-bold text-sm text-slate-700">
                  {item.title}
                </div>
                <div className="text-slate-300">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  );
}
