import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, CalendarClock, Link2, ShieldCheck, Clock, HeadphonesIcon, Copy, Upload, CheckCircle } from 'lucide-react';
import QRCode from 'react-qr-code';
import { addSimulatedTransaction } from '../utils/user';

import { useTranslation } from '../context/LanguageContext';

export default function Recharge() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const address = "0x891fd53D1AE05Ae3e92505c30F1A03faf01ba66A";

  const [rechargeAmt, setRechargeAmt] = useState('');
  const [proofImage, setProofImage] = useState('');
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitRecharge = () => {
    setErrorMsg('');
    setSuccessMsg('');

    const parsedAmt = parseFloat(rechargeAmt);
    if (isNaN(parsedAmt) || parsedAmt <= 0) {
      setErrorMsg('الرجاء إدخال مبلغ شحن صحيح.');
      return;
    }

    if (!proofImage) {
      setErrorMsg('الرجاء رفع صورة إثبات الدفع لتأكيد المعاملة.');
      return;
    }

    addSimulatedTransaction(
      "deposit",
      parsedAmt,
      "BEP20",
      address,
      proofImage,
      localStorage.getItem("userId") || "10001"
    );

    setSuccessMsg('تم إرسال إثبات الشحن بنجاح! الإدارة ستراجع طلبك وتضيف الأموال إلى حسابك فوراً.');
    setRechargeAmt('');
    setProofImage('');
    setFileName('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
  };

  return (
    <div className="min-h-screen bg-white font-sans pb-10" dir="rtl">
      {/* Header */}
      <header className="bg-[#3a7af2] text-white flex items-center h-[50px] px-4 sticky top-0 z-50 shrink-0">
        <button onClick={() => navigate(-1)} className="p-1 -mr-1">
          <ChevronRight size={26} strokeWidth={2} />
        </button>
        <h1 className="text-[17px] font-bold text-center flex-1 pr-6">تيثر</h1>
      </header>

      <div className="p-3 space-y-3">
        {/* Main QR Card */}
        <div className="border border-[#75b0d6] rounded-xl p-3 relative overflow-hidden bg-white shadow-sm mt-1">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAgMEw2MCAxNS4zdjMwTDMwIDYwIDAgNDUuM3YtMzBMMzAgMHpNMTUgNDUuMmwzMCAxNUM2MCA0NS4yIDYwIDE1LjMgNjAgMTUuM0wzMCAwaC0zdjYwaDN6TTAgNDUuM2wxNS03LjZ2LTE1bDMyLTE2LDAtMTUgMCAwLTMyIDE2djE1bC0xNSA3LjZ6IiBmaWxsPSIjMWE3OGRjIiBmaWxsLW9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')] mix-blend-multiply flex justify-center items-center">
             <div className="w-[100px] h-[100px] bg-[#3a7af2] rounded-full blur-[30px] absolute right-[-30px] bottom-0"></div>
             <div className="w-[100px] h-[100px] bg-[#3a7af2] rounded-full blur-[30px] absolute left-[-30px] top-0"></div>
          </div>

          <div className="relative z-10">
            {/* Top Badge */}
            <div className="bg-gradient-to-b from-[#e3cda5] to-[#c29c66] text-gray-800 font-medium py-1.5 rounded-md text-center text-[13px] mb-3 shadow-sm">
              BEP20-USDT
            </div>

            <h2 className="text-center text-gray-800 font-medium text-[13px] mb-3">
              رمز الاستجابة السريعة لإعادة الشحن
            </h2>

            {/* QR Code */}
            <div className="flex justify-center mb-3">
              <div className="p-1.5 border border-gray-100 rounded-lg shadow-sm">
                <QRCode
                  value={address}
                  size={120}
                  level={"H"}
                />
              </div>
            </div>

            {/* Address Row */}
            <div className="bg-[#f0f2f5] rounded-md p-2 flex items-center justify-between">
              <span className="font-mono text-[12px] text-gray-700 truncate w-full text-left" dir="ltr">
                {address.slice(0, 36)}...
              </span>
              <button onClick={handleCopy} className="text-gray-500 pl-1.5 cursor-pointer active:scale-95 hover:text-gray-700">
                <Copy size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Warning Text */}
        <div className="text-center pt-1">
          <div className="text-[14px] font-bold text-gray-900 leading-snug">
            عند الإيداع، يرجى التأكد من اختيار شبكة
            <br />
            .BEP20 (BSC)
          </div>
          <div className="text-[14.5px] font-bold text-gray-900 mt-2 mb-1.5">
            تذكير ودي: دليل إعادة الشحن
          </div>
        </div>

        {/* Guide Table */}
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col items-stretch text-[11.5px] relative">
           
           {/* Section 1 */}
           <div className="border-b border-gray-200 bg-[#f5f8fc]">
              <div className="flex items-center justify-between p-1.5">
                 <div className="flex items-center gap-1.5 font-bold text-gray-800 text-[12.5px]">
                    <div className="bg-white rounded-md p-0.5"><CalendarClock size={16} className="text-[#e26b6f]" /></div>
                    إعادة شحن 24/7
                 </div>
                 <div className="text-gray-400 text-[12px]">⚙️⚡</div>
              </div>
              <div className="grid grid-cols-2 divide-x divide-x-reverse divide-gray-200 border-t border-gray-200 bg-white">
                 <div className="p-1.5 text-center font-bold text-gray-800">العملية</div>
                 <div className="p-1.5 text-center font-bold text-gray-800">توفر القناة:</div>
              </div>
              <div className="grid grid-cols-2 divide-x divide-x-reverse divide-gray-200 border-t border-gray-200 bg-white">
                 <div className="p-1.5 text-center text-gray-800">ابدأ في أي وقت؛ إضافة تلقائية للرصيد</div>
                 <div className="p-1.5 text-center text-gray-800">24/7</div>
              </div>
           </div>

           {/* Section 2 */}
           <div className="border-b border-gray-200 bg-[#f5f8fc]">
              <div className="flex items-center gap-1.5 font-bold text-gray-800 p-1.5 text-[12.5px]">
                 <div className="bg-white rounded-full p-0.5"><Link2 size={14} className="text-[#3c78d8]" /></div>
                 تحويل على السلسلة
              </div>
              <div className="border-t border-gray-200 bg-white p-2 flex justify-between items-center text-gray-800 font-bold">
                 <span>الشبكة الصحيحة: USDT-BEP20</span>
                 <div className="flex items-center gap-1">
                    <span className="bg-[#4d3b2c] text-[#cdb788] text-[7.5px] font-bold px-1 py-0.5 rounded-full">BEP20</span>
                    <span className="text-[#51cd98] text-[10px]">✔️</span>
                 </div>
              </div>
              <div className="border-t border-gray-200 bg-white p-2 flex justify-between items-center text-gray-800 font-bold">
                 <span>الشبكات غير الصحيحة: ERC20، OPBNB، إلخ.</span>
                 <span className="text-[#e25d5d] text-[10px]">❌</span>
              </div>
           </div>

           {/* Section 3 */}
           <div className="border-b border-gray-200 bg-[#f5f8fc]">
              <div className="flex items-center gap-1.5 font-bold text-gray-800 p-1.5 text-[12.5px]">
                 <div className="text-green-500"><ShieldCheck size={16} fill="#e6f4ea" /></div>
                 التحقق من إعادة الشحن
              </div>
              <div className="border-t border-gray-200 bg-white p-2 text-gray-800">
                 <span className="font-bold">تطابق العنوان:</span> تحقق من مطابقة عنوان BEP20 مع مول Stack Mall. 🔍
              </div>
              <div className="border-t border-gray-200 bg-white p-2 text-gray-800">
                 <span className="font-bold">هاش المعاملة:</span> تأكيد الحالة في سجل المعاملات. 🛡️
              </div>
           </div>

           {/* Section 4 */}
           <div className="border-b border-gray-200 bg-[#f5f8fc]">
              <div className="flex items-center justify-between p-1.5">
                 <div className="flex items-center gap-1.5 font-bold text-gray-800 text-[12.5px]">
                    <div className="bg-white rounded-full p-0.5"><Clock size={14} className="text-[#c44a4a]" /></div>
                    وقت الوصول
                 </div>
                 <div className="text-gray-400 text-[12px]">⏳✨</div>
              </div>
              <div className="grid grid-cols-[1fr_2fr_1fr_3fr] divide-x divide-x-reverse divide-gray-200 border-t border-gray-200 bg-white">
                 <div className="p-1.5 flex items-center justify-center font-bold text-gray-800">عادي</div>
                 <div className="p-1.5 text-center text-gray-800 flex items-center justify-center">إضافة تلقائية بعد تأكيد الشبكة.</div>
                 <div className="p-1.5 flex items-center justify-center font-bold text-gray-800">ازدحام</div>
                 <div className="p-1.5 text-center text-gray-800">تأخير طفيف محتمل. <span className="block">*يرجى التحلي بالصبر!*</span></div>
              </div>
           </div>

           {/* Section 5 */}
           <div className="bg-[#f5f8fc]">
              <div className="flex items-center justify-between p-1.5">
                 <div className="flex items-center gap-1.5 font-bold text-gray-800 text-[12.5px]">
                    <div className="bg-white rounded-full p-0.5"><HeadphonesIcon size={14} className="text-[#3c78d8]" /></div>
                    دعم الخدمة
                 </div>
                 <div className="text-[#ebc03e] text-[12px]">🧑‍💻</div>
              </div>
              <div className="border-t border-gray-200 bg-white p-2 text-gray-800">
                 <span className="font-bold">الاتصال:</span> المستشار أو موظف خدمة العملاء
              </div>
              <div className="border-t border-gray-200 bg-white p-2 text-gray-800">
                 <span className="font-bold">متى:</span> في حال وجود مشاكل أثناء عملية إعادة الشحن
               </div>
            </div>
         </div>

         {/* نموذج تأكيد الدفع وإرسال الإثبات */}
         <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mt-4 space-y-4 font-sans text-right" dir="rtl">
            <h3 className="text-[#3a7af2] font-bold text-[15px] border-b border-gray-100 pb-2">
               تقديم طلب إعادة الشحن
            </h3>

            {/* Error and Success states */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-xs font-bold leading-relaxed text-center">
                ⚠️ {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-xs font-bold leading-relaxed text-center">
                🎉 {successMsg}
              </div>
            )}

            {/* Amount input */}
            <div className="space-y-1">
               <label className="block text-gray-700 text-[13px] font-semibold">المبلغ المراد شحنه (USDT)</label>
               <input
                 type="number"
                 placeholder="الرجاء كتابة المبلغ الذي قمت بتحويله"
                 value={rechargeAmt}
                 onChange={(e) => setRechargeAmt(e.target.value)}
                 className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#3a7af2] font-mono text-center"
               />
            </div>

            {/* Drag & Drop File Upload */}
            <div className="space-y-1">
               <label className="block text-gray-700 text-[13px] font-semibold">إثبات الدفع (لقطة الشاشة للتحويل)</label>
               <label 
                 onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                 onDragLeave={() => setIsDragging(false)}
                 onDrop={(e) => {
                   e.preventDefault();
                   setIsDragging(false);
                   const file = e.dataTransfer.files?.[0];
                   if (file) {
                     setFileName(file.name);
                     const reader = new FileReader();
                     reader.onloadend = () => { setProofImage(reader.result as string); };
                     reader.readAsDataURL(file);
                   }
                 }}
                 className={`border-2 border-dashed rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                   isDragging ? 'border-[#3a7af2] bg-[#f0f5ff]' : 'border-gray-200 hover:border-gray-300 bg-slate-50'
                 }`}
               >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Upload size={24} className="text-[#3a7af2] mb-1" />
                  <span className="text-[12px] font-semibold text-gray-700">اضغط لرفع الصورة أو اسحبها هنا</span>
                  <span className="text-[10px] text-gray-400 mt-1">تنسيق الصور المدعومة: PNG, JPG, JPEG</span>
                  
                  {fileName && (
                    <div className="mt-2 text-xs font-bold text-green-600 bg-green-50 border border-green-100 rounded px-2 py-1 flex items-center gap-1 mx-auto max-w-[80%]">
                      <CheckCircle size={12} className="shrink-0" />
                      <span className="truncate">تم اختيار: {fileName}</span>
                    </div>
                  )}
               </label>
            </div>

            {/* Preview loaded image */}
            {proofImage && (
              <div className="border border-gray-100 rounded-lg p-2 bg-slate-50 flex flex-col items-center">
                <span className="text-[10px] font-medium text-gray-500 mb-1">معاينة صورة الإثبات:</span>
                <img src={proofImage} alt="Payment Proof" className="max-h-[140px] rounded object-contain border border-gray-200" />
              </div>
            )}

            {/* Confirm Recharge Button */}
            <button
               onClick={handleSubmitRecharge}
               className="w-full bg-[#3a7af2] hover:bg-blue-600 text-white font-bold py-2.5 rounded-lg text-[13px] shadow-sm shadow-blue-500/20 active:scale-[0.98] transition-transform cursor-pointer text-center"
            >
               تأكيد وإرسال الإثبات للإدارة
            </button>
         </div>

       </div>
    </div>
  );
}
