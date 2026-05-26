import { ArrowRight, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  bgClass?: string;
}

export default function Header({ title, showBack = true, bgClass = 'bg-header-gradient' }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={`sticky top-0 z-50 h-14 ${bgClass} text-white flex items-center justify-between px-4 shadow-md`}>
      <div className="flex-1">
        {showBack && (
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 rounded-full active:bg-white/10 transition-colors">
            <ArrowRight size={24} />
          </button>
        )}
      </div>
      <h1 className="text-lg font-bold flex-1 text-center truncate px-2">{title}</h1>
      <div className="flex-1 flex justify-end">
        {/* Right side placeholder - could be language selector or settings depending on the page */}
      </div>
    </header>
  );
}
