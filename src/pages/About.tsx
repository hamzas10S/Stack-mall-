import Header from '../components/Header';

export default function About() {
  return (
    <div className="min-h-screen bg-[#f3f6fa] font-sans pb-10" dir="rtl">
      <Header title="نبذة عن الشركة" bgClass="bg-[#1b75d9]" />
      
      <div className="w-full flex flex-col bg-[#1b75d9]">
        
        {/* Hero Section */}
        <div className="relative pt-4 px-4 flex justify-between items-start">
           <div className="text-white font-bold flex flex-col items-start leading-[1.1]">
              <span className="text-[32px] tracking-tight text-right w-full">الشركة</span>
              <span className="text-[26px] tracking-tight text-right w-full">الملف الشخصي</span>
              <span className="text-[22px] mt-0.5 text-right w-full">ستاك مول</span>
           </div>
           
           <div className="bg-white p-2 rounded-sm shadow-md flex flex-col items-center justify-center shrink-0 ml-2 z-10 w-[60px] h-[60px]">
              <div className="text-[#e23f66] font-bold text-[28px] font-mono leading-none tracking-tighter">SM</div>
              <div className="text-[7.5px] font-bold text-gray-800 mt-1">Stack Mall</div>
           </div>
        </div>

        {/* Hero Image */}
        <div className="w-full mt-3 bg-white relative">
          <div className="w-full h-8 bg-[#1b75d9] absolute top-0 left-0" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 100%)' }}></div>
          <div className="w-full h-8 bg-[#1b75d9] absolute bottom-0 left-0 z-10" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)' }}></div>
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80" 
            alt="Business Building" 
            className="w-full h-[160px] object-cover" 
          />
        </div>

        {/* Company Qualifications */}
        <div className="bg-[#1b75d9] px-4 py-4 text-white pb-6">
           <h2 className="text-[24px] font-bold text-center mb-3 text-white drop-shadow-md">
             :مؤهلات الشركة
           </h2>
           <p className="text-[12px] leading-relaxed mb-3 text-center font-medium opacity-95">
             Stack Media: شريك نمو في منظومة تيك توك، يُمكن العلامات التجارية والمبدعين من خلال محرك أعمال عالمي
           </p>
           <p className="text-[12px] leading-[1.6] text-center font-medium opacity-90">
             ترسيخ مكانة العلامة التجارية: تأسست Stack Media في لندن عام 2022، وهي شريك نمو متكامل ضمن منظومة تيك توك، تُركز على تزويد العلامات التجارية والمبدعين بحلول التجارة الإلكترونية للمحتوى الأصلي ثنائي المحرك. وهي شريك أعمال موثوق به قائم على الإبداع والبيانات لكبار البائعين في المملكة المتحدة وحول العالم.
           </p>
        </div>

        {/* Stack Mall Huge Text over Image */}
        <div className="relative h-[150px] w-full overflow-hidden">
           <img 
             src="https://images.unsplash.com/photo-1577700511874-9e8cbb62e921?auto=format&fit=crop&w=800&q=80" 
             alt="Cityscape" 
             className="w-full h-full object-cover brightness-[0.6] sepia-[0.2] hue-rotate-[190deg]" 
           />
           <div className="absolute inset-0 bg-[#0e3b75]/30 mix-blend-multiply"></div>
           <div className="absolute inset-0 flex items-center justify-center">
             <h2 className="text-[42px] font-bold text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] mb-[-10px] whitespace-nowrap">
               ستاك مول
             </h2>
           </div>
        </div>

        {/* Core Business Sectors */}
        <div className="bg-[#1b75d9] pt-6 pb-3 flex flex-col items-center">
           <h2 className="text-[26px] font-bold text-white text-center leading-tight">
             قطاعات<br/>الأعمال الأساسية
           </h2>
           <div className="w-[85%] h-1 bg-white mt-1 shadow-sm"></div>
        </div>

        {/* Creator Agency Services */}
        <div className="bg-white mx-0 px-4 pt-2.5 pb-4 flex justify-center">
          <h3 className="text-[#1b75d9] text-[16px] font-bold text-center">
            خدمات وكالة المبدعين
          </h3>
        </div>

        <div className="bg-[#1b75d9] px-4 py-5 text-white space-y-3">
           <p className="text-[12px] font-bold leading-relaxed text-center">
             بصفتنا الشريك الحصري لوكالة المبدعين لدى تيك توك، نربط العلامات التجارية بموارد عالمية متميزة من المبدعين، ونقدم ما يلي:
           </p>
           
           <p className="text-[11px] font-medium leading-relaxed text-center opacity-95">
             اكتشاف المبدعين والتعاقد معهم: تحليل بيانات قائم على الذكاء الاصطناعي يطابق بدقة العلامات التجارية مع المبدعين المتخصصين الذين يتناسبون مع ذوقها الجمالي (يشمل الأزياء، والجمال، والسلع المنزلية، والطعام، وجميع الفئات)؛
           </p>
           
           <p className="text-[11px] font-medium leading-relaxed text-center opacity-95">
             احتضان المحتوى الأصلي: صياغة محتوى فيروسي مُحسّن لخوارزمية تيك توك لزيادة الزيارات العضوية للعلامات التجارية؛
           </p>

           <p className="text-[11px] font-medium leading-relaxed text-center opacity-95">
             إدارة تحقيق الدخل من المبدعين: توفير دعم شامل لتحقيق الدخل من الزيارات والتعاون مع العلامات التجارية، مما يتيح عملية "متكاملة" من إنشاء المحتوى إلى التحويل التجاري.
           </p>

           {/* Three images row */}
           <div className="grid grid-cols-3 gap-2 mt-4 pb-2">
             <div className="bg-white rounded-lg overflow-hidden aspect-[4/5] border border-white shadow-md">
               <img src="https://images.unsplash.com/photo-1542316373-b27bcfb92d6e?auto=format&fit=crop&w=300&q=80" alt="Building" className="w-full h-full object-cover" />
             </div>
             <div className="bg-white rounded-lg overflow-hidden aspect-[4/5] border border-white shadow-md">
               <img src="https://images.unsplash.com/photo-1516280440502-a2267ea04561?auto=format&fit=crop&w=300&q=80" alt="Creator" className="w-full h-full object-cover object-top" />
             </div>
             <div className="bg-white rounded-lg overflow-hidden aspect-[4/5] border border-white shadow-md bg-[#eef5fa] flex items-center justify-center p-2 pt-4">
               <img src="https://images.unsplash.com/photo-1581451007261-2fed4a1be70b?auto=format&fit=crop&w=300&q=80" alt="Shopping cart" className="w-full h-full object-contain mix-blend-multiply" />
             </div>
           </div>
        </div>

        {/* Intro to Stack Mall Section */}
        <div className="bg-[#1b75d9] pt-6 pb-3 flex flex-col items-center">
           <h2 className="text-[26px] font-bold text-white text-center leading-[1.1]">
             مقدمة<br/>عن ستاك مول:
           </h2>
           <div className="w-[85%] h-0.5 bg-white mt-2 mb-4 shadow-sm"></div>
           
           <p className="text-white text-[12px] text-center px-4 leading-relaxed font-medium mb-6">
             يقدم حلولاً متكاملة للتجارة الإلكترونية على تيك توك، تغطي دورة حياة المنتج بالكامل، من "إنشاء المتجر إلى النمو العالمي":
           </p>

           {/* List items */}
           <div className="w-full px-4 space-y-4 pb-6 relative z-10">
             
             {/* Item 1 */}
             <div className="bg-[#8abcd5] rounded-[8px] pl-3 pr-2 py-2.5 relative border-r-2 border-l border-white shadow-md">
                <div className="absolute top-0 right-4 transform -translate-y-1/2 bg-white rounded-full px-2.5 py-0.5 flex items-center gap-1 border-2 border-white shadow-sm h-[24px]">
                   <span className="text-[#101010] text-[11px] font-bold whitespace-nowrap pt-0.5">عمليات المنتجات:</span>
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-black ml-0.5"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.68a6.34 6.34 0 0 0 6.26 6.36 6.35 6.35 0 0 0 6.25-6.36v-6.7a8.21 8.21 0 0 0 5.49 2V7.47a4.93 4.93 0 0 1-3.41-.78z"/></svg>
                </div>
                <p className="text-[#1f3c4c] text-[11px] font-medium text-center leading-[1.6] pt-1">
                  خدمات شاملة تشمل إنشاء المتجر، واستراتيجيات اختيار المنتجات، وإدارة المخزون، وتلبية الطلبات، بما يتوافق مع لوائح السوق البريطانية والعالمية.
                </p>
             </div>

             {/* Item 2 */}
             <div className="bg-[#8abcd5] rounded-[8px] pl-3 pr-2 py-2.5 relative border-r-2 border-l border-white shadow-md">
                <div className="absolute top-0 right-4 transform -translate-y-1/2 bg-white rounded-full px-2.5 py-0.5 flex items-center gap-1 border-2 border-white shadow-sm h-[24px]">
                   <span className="text-[#101010] text-[11px] font-bold whitespace-nowrap pt-0.5">التسويق بالعمولة:</span>
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-black ml-0.5"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.68a6.34 6.34 0 0 0 6.26 6.36 6.35 6.35 0 0 0 6.25-6.36v-6.7a8.21 8.21 0 0 0 5.49 2V7.47a4.93 4.93 0 0 1-3.41-.78z"/></svg>
                </div>
                <p className="text-[#1f3c4c] text-[11px] font-medium text-center leading-[1.6] pt-1 mt-0.5">
                  بناء شبكات تسويق بالعمولة حصرية للعلامة التجارية، والاستفادة من منشئي المحتوى، وخبراء التسويق الرئيسيين، وموارد التسويق بالعمولة لتحقيق نمو هائل في المبيعات.
                </p>
             </div>

             {/* Item 3 */}
             <div className="bg-[#8abcd5] rounded-[8px] pl-3 pr-2 py-2.5 relative border-r-2 border-l border-white shadow-md mt-6">
                <div className="absolute top-0 right-4 transform -translate-y-1/2 bg-white rounded-full px-2.5 py-0.5 flex items-center gap-1 border-2 border-white shadow-sm h-[24px]">
                   <span className="text-[#101010] text-[11px] font-bold whitespace-nowrap pt-0.5">إدارة الإعلانات المدفوعة:</span>
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-black ml-0.5"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.68a6.34 6.34 0 0 0 6.26 6.36 6.35 6.35 0 0 0 6.25-6.36v-6.7a8.21 8.21 0 0 0 5.49 2V7.47a4.93 4.93 0 0 1-3.41-.78z"/></svg>
                </div>
                <p className="text-[#1f3c4c] text-[11px] font-medium text-center leading-[1.6] pt-1 mt-0.5">
                  استهداف دقيق من خلال إعلانات تيك توك، وتحسين عائد الاستثمار من خلال نمذجة البيانات عبر جميع التنسيقات، بما في ذلك TopView، وشاشات البداية، ومواضع الخلاصات.
                </p>
             </div>

           </div>
        </div>

        {/* 3D Night Image */}
        <div className="w-full relative bg-[#1b75d9]">
          <img 
            src="https://images.unsplash.com/photo-1627844642677-8b43825fd9f8?auto=format&fit=crop&w=800&q=80" 
            alt="TikTok 3D" 
            className="w-full h-[180px] object-cover" 
          />
          {/* Faux TikTok logo overlay to match the screenshot vibe loosely */}
          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
             <div className="bg-black/40 rounded-[20px] p-3 backdrop-blur-sm border border-white/10 shadow-2xl skew-y-12 mb-3 transform -rotate-12">
               <svg width="36" height="36" viewBox="0 0 24 24" fill="white"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.68a6.34 6.34 0 0 0 6.26 6.36 6.35 6.35 0 0 0 6.25-6.36v-6.7a8.21 8.21 0 0 0 5.49 2V7.47a4.93 4.93 0 0 1-3.41-.78z"/></svg>
               <span className="text-white font-bold tracking-tighter mt-1 block text-center text-[12px]">TikTok</span>
             </div>
             <div>
                <span className="bg-[#f0612c] text-white px-4 py-1.5 rounded-full font-bold text-[12px]">ستاك مول</span>
             </div>
          </div>
        </div>

        {/* Core Advantages */}
        <div className="bg-[#e4ebf2] py-6 w-full flex flex-col items-center">
           <h2 className="text-[26px] font-bold text-black text-center mb-5 drop-shadow-sm">
             المزايا الأساسية
           </h2>

           <div className="w-full px-4 space-y-5">
              
              {/* Item 1 */}
              <div className="bg-[#b5cce8] rounded-[6px] relative px-3 py-4 shadow-sm">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1b75d9] text-white px-6 py-1 rounded-md font-bold text-[13px] whitespace-nowrap shadow-md">
                    الدافع الإبداعي:
                 </div>
                 <p className="text-[#3b4c5c] text-[11.5px] font-medium text-center leading-[1.6] mt-1">
                   يتمتع فريقنا الإبداعي في لندن بفهم عميق للثقافة الغربية وبيئة محتوى تيك توك، ويصمم محتوى واستراتيجيات تسويق محلية وقابلة للمشاركة.
                 </p>
              </div>

              {/* Item 2 */}
              <div className="bg-[#b5cce8] rounded-[6px] relative px-3 py-4 shadow-sm mt-6">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1b75d9] text-white px-6 py-1 rounded-md font-bold text-[13px] whitespace-nowrap shadow-md">
                    مُعتمد على البيانات:
                 </div>
                 <p className="text-[#3b4c5c] text-[11.5px] font-medium text-center leading-[1.6] mt-1 text-balance">
                   استخدم خوارزميات الذكاء الاصطناعي وتحليلات البيانات الضخمة لتحسين اختيار المنتجات، ووضع الإعلانات، ومطابقة منشئي المحتوى، مما يُقلل من تكاليف التجربة والخطأ.
                 </p>
              </div>

              {/* Item 3 */}
              <div className="bg-[#b5cce8] rounded-[6px] relative px-3 py-4 shadow-sm mt-6">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1b75d9] text-white px-8 py-1 rounded-md font-bold text-[13px] whitespace-nowrap shadow-md">
                    تنفيذ قوي:
                 </div>
                 <p className="text-[#3b4c5c] text-[11.5px] font-medium text-center leading-[1.6] mt-1">
                   استفد من فريق عمليات التجارة الإلكترونية العابرة للحدود ذي الخبرة ونظام إدارة منشئي المحتوى لضمان التنفيذ الفعال، من الاستراتيجية إلى التنفيذ.
                 </p>
              </div>

              {/* Item 4 */}
              <div className="bg-[#b5cce8] rounded-[6px] relative px-3 py-4 shadow-sm mt-6">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1b75d9] text-white px-8 py-1 rounded-md font-bold text-[13px] whitespace-nowrap shadow-md">
                    موارد عالمية:
                 </div>
                 <p className="text-[#3b4c5c] text-[11.5px] font-medium text-center leading-[1.6] mt-1 text-balance">
                   تواصل مع أفضل مُنشئي محتوى تيك توك في المملكة المتحدة والعالم، بالإضافة إلى موارد العلامات التجارية، لمساعدة العملاء على التوسع بسرعة في الأسواق العالمية.
                 </p>
              </div>
           </div>
        </div>

        {/* Service Value Section */}
        <div className="bg-[#1b75d9] pt-6 pb-4 relative">
           <h2 className="text-[26px] font-bold text-white text-center pb-2">
             :قيمة الخدمة
           </h2>
           <div className="w-[85%] h-0.5 bg-white shadow-sm mx-auto mb-4"></div>
           
           <p className="text-white text-[11px] text-center px-4 leading-[1.6] font-medium mb-8 opacity-95">
             مساعدة العلامات التجارية على تجاوز عوائق حركة المرور وتحقيق الربح في تيك توك، مما يعزز الكفاءة طوال رحلة الوصول إلى المحتوى، من "عرض المحتوى" إلى "التحويل إلى التجارة الإلكترونية". تمكين المبدعين من تعظيم قيمة المحتوى، والتحول من "مؤثرين في حركة المرور" إلى "أصحاب حقوق ملكية فكرية تجارية". زيادة المبيعات، وتحقيق نجاحات فيروسية، وتعزيز حضور العلامة التجارية. تمكين التجار العالميين من تحقيق نمو في المنتجات وإيرادات المعاملات، مما يعزز فهمهم لإمكانيات تيك توك.
           </p>

           <div className="w-full relative" style={{ height: '180px' }}>
              <div className="absolute inset-0 bg-[#341656]/50"></div>
              <img 
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80" 
                alt="Cyberpunk Mall" 
                className="w-full h-full object-cover mix-blend-overlay" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b75d9] via-[#1b75d9]/60 to-transparent"></div>
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#f0612c] text-white px-5 py-1 rounded-full font-bold text-[12px] shadow-lg flex items-center justify-center min-w-[100px]">
                ستاك مول
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center flex-col opacity-90">
                 <div className="bg-black/60 rounded-[20px] p-4 backdrop-blur-md shadow-[0_0_20px_rgba(255,100,200,0.4)] border border-pink-500/30">
                   <span className="text-white font-bold text-3xl block text-center uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-pink-500 shadow-sm" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>TikTok</span>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
