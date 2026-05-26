import Header from '../components/Header';

const tasks = [
  { id: 1, title: 'أوصي أعضاء 1 بالانضمام', progress: '(0/1)', reward: '1.00' },
  { id: 2, title: 'أوصي أعضاء 5 بالانضمام', progress: '(0/5)', reward: '7.00' },
  { id: 3, title: 'أوصي أعضاء 10 بالانضمام', progress: '(0/10)', reward: '18.00' },
  { id: 4, title: 'أوصي أعضاء 30 بالانضمام', progress: '(0/30)', reward: '60.00' },
  { id: 5, title: 'أوصي أعضاء 50 بالانضمام', progress: '(0/50)', reward: '120.00' },
  { id: 6, title: 'أوصي أعضاء 100 بالانضمام', progress: '(0/100)', reward: '450.00' }
];

export default function Rewards() {
  return (
    <div className="min-h-screen bg-[#f0f4f8] pb-4">
      <Header title="المكافآت التراكمية" bgClass="bg-header-gradient" />
      <div className="p-4 space-y-4">
        <div className="bg-gradient-to-br from-green-700 to-green-600 rounded-xl p-3 shadow-sm text-white">
          <h2 className="font-bold text-[13px] mb-1 text-yellow-300">مكافآت Stack Mall التراكمية</h2>
          <p className="text-[11px] leading-relaxed opacity-90">يمكن للمشترين الذين يتدحرجون ربح مكافآت مقابل كل هدف يحققونه عند ترقيتهم إلى شركاء كاملين عن طريق إعادة الشحن. هذه المكافآت تراكمية ويمكن جمعها. كلما زاد عدد الأهداف التي تحققها، زادت مكافآتك القيمة!</p>
        </div>
        
        <div className="space-y-2">
          {tasks.map(task => (
            <div key={task.id} className="bg-white rounded-lg p-2.5 shadow-sm border border-slate-100 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 text-[12px]">{task.title}</span>
                <span className="text-slate-400 font-bold text-[12px] tracking-wider">{task.progress}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-bold text-[10px] bg-slate-50 px-1.5 py-0.5 rounded-md">يمكنك الحصول على</span>
                  <span className="font-mono text-amber-500 font-bold text-[14px]">${task.reward}</span>
                </div>
                <button className="border border-blue-500 text-blue-600 px-3 py-1 rounded-full font-bold text-[11px] hover:bg-blue-50 transition-colors">
                  اذهب للدعوة
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
