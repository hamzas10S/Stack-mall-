import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "ar" | "en";

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, enText?: string) => string;
  dir: "rtl" | "ltr";
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

// A comprehensive translation index of StackMall Arabic strings to English strings
const translationMap: Record<string, string> = {
  // Missing prominent strings
  "كمية دروبشيبينغ المنتج": "Dropship Sub-Quantity",
  "يقتصر على عملية شراء واحدة لكل شخص": "Limited to 1 purchase per person",
  "رقم الإصدار": "Issue Num",
  "سعر": "Price",
  "يحصل": "Yield",
  "تاريخ الافراج عنه": "Release Date",
  "يشتري": "Buy",
  "رصيد المحفظة المتاح": "Available Wallet Balance",
  "منتهي الصلاحية": "Expired",
  "انسحاب": "Withdraw",
  "إضافة نوع": "Type",
  "شبكة": "Network",
  "كلمة مرور المعاملة": "Transaction Pass",
  "يُقدِّم": "Submit",
  "يُقدّم": "Submit",
  "رسوم السحب": "Withdrawal Fee",
  "رسوم السحب:": "Withdrawal Fee:",
  "المبلغ الفعلي المستلم:": "Received amount:",
  "المبلغ الفعلي المستلم": "Received amount",
  "كلمة مرور الدفع": "Payment Pass",
  "إحاطة تكميلية": "Additional Brief",
  "أمر المطالبة": "Claim Order",
  "تم الشراء ✔️": "Purchased ✔️",
  "وصلت البضائع": "Arrived",
  "شراء": "Purchase",

  // Bottom / Layout Tabs
  بيت: "Home",
  "الشخص المسؤول": "Team Group",
  "طاولة العمل": "Workspace",
  "انضم إلينا": "Join Us",
  ملكي: "Profile",

  // Setup / General
  "Stack Mall": "Stack Mall",
  "STACKMALL": "STACKMALL",
  "اختيار اللغة": "Language Select",
  عربي: "العربية (Arabic)",
  English: "English",
  "تحميل التطبيق": "Download APP",
  "Download APP": "Download APP",

  // Login Page
  "الرجاء إدخال رقم الهاتف": "Please enter your phone number",
  ".الرجاء إدخال كلمة المرور الخاص بك": "Please enter your password",
  ".الرجاء إدخال كلمة المرور الخاصة بك": "Please enter your password",
  "تذكر كلمة مرور حسابك": "Remember my password",
  "تسجيل الدخول الآن": "Login Now",
  "ليس لديك حساب؟يسجل": "Don't have an account? Register",
  "ليس لديك حساب؟ يسجل": "Don't have an account? Register & join us",

  // Register Page
  ".الرجاء إدخال رمز التحقق": "Please enter verification code",
  ".الرجاء إدخال رمز التحقق.": "Please enter verification code",
  "الرجاء إدخال رمز التحقق": "Please enter verification code",
  "الرجاء إدخال رمز الدعوة": "Please enter invite code",
  "سجل الآن": "Register Now",
  "يرجى تأكيد كلمة المرور الخاصة بك": "Please confirm your password",
  ".يرجى تأكيد كلمة المرور الخاصة بك": "Please confirm your password",
  ".يرجى تأكيد كلمة المرور": "Please confirm your password",
  "كلمة المرور المكونة من 6 أرقام": "6-digit payment password",
  "رجاء إدخال كلمة المرور الخاصة بك المكونة من 6 أرقام": "Please enter your 6-digit payment password",
  "مستوى قوة كلمة المرور:": "Password strength level:",
  ضعيف: "Weak",
  متوسط: "Medium",
  "قوي جداً": "Very Strong",
  "هل لديك حساب بالفعل؟ قم بتسجيل الدخول": "Already have an account? Sign in",
  "&lt;&lt;.هل لديك حساب بالفعل؟ قم بتسجيل الدخول": "Already have an account? Login",

  // Home Page Cards
  "مقدمة عن الشركة": "About Company",
  "فريق متخصص في تكنولوجيا المعلومات": "IT Experts Team",
  "شراء الأسهم": "Buy Shares",
  "المعلومات بديهية وسهلة التصفح": "Intuitive, Easy Information",
  "الاستيلاء على الطلبات": "Grab Orders",
  "مهام حصرية عالية الجودة": "Premium Task Grab",
  "سعادة الفريق": "Team Perks",
  "تتراكم المكافآت وتستمر في القدوم!": "Infinite perks are ready!",
  "قائمة المنتجات": "Products",
  "لقد تلقيت جميع طلبات الشراء": "All current grab tasks completed",

  // VIP / Workbench Page
  "الحصول على الطلب": "Receive Order",
  "الشراء نيابة عن الآخرين": "Buy on Behalf",
  "غير مشحونة": "Unshipped",
  "تم الشحن": "Shipped",
  "لقد وصلت البضائع": "Goods Arrived",
  ".لقد تلقيت جميع طلبات الشراء": "All current purchase orders grabbed successfully.",
  "المستوى الحالي": "Current Level",
  "إنتاج رصيد المهام اليومية": "Daily Tasks Yield Status",
  "الرصيد المتاح:": "Available Balance:",
  "عضوية العمل الفعالة": "Active Workspace Level",
  "انقر فوق الزر أدناه لبدء استلام الطلبات واسترداد العمولات": "Click bottom option to start purchase orders and claim reward commissions",
  "البدء": "Start",
  "ابدأ استلام الطلبات": "Take Grab Orders",
  "طلب معلق": "Pending Request",
  "مكتمل": "Success Logs",
  "إجمالي الإيرادات": "Total Income",
  "دخل اليوم": "Today Profits",
  "عدد المهام اليوم المتبقية": "Remaining daily items to grab",

  // Team Page
  "فريقي": "My Team",
  "رمز الدعوة": "Invite Code",
  "رابط الدعوة": "Invite URL",
  "ينسخ": "Copy",
  "تم!": "Copied!",
  "فريق": "Team",
  "فريق A": "Team A",
  "فريق B": "Team B",
  "فريق C": "Team C",
  "حجم الفريق": "Team Size",
  "المستخدمون الصالحون": "Valid Users",
  "قواعد المكافأة": "Dividend Rules",
  "مستوى أ": "Lvl A",
  "مستوى ب": "Lvl B",
  "مستوى ج": "Lvl C",
  "رقم الهاتف": "Phone Num",
  "وقت التسجيل": "Sign-up Date",
  "عمولة": "Commission Rate",

  // Mall Page
  السجلات: "History",
  "الدخل اليومي:": "Daily Income:",
  "كمية:": "Price:",

  // Profile Page
  "الرصيد الحالي": "Current Balance",
  "تعبئة رصيد": "Top Up",
  "سحب": "Withdraw",
  "تاريخ إعادة الشحن": "Top-up Logs",
  "سجل السحوبات": "Withdrawal Logs",
  "مركز المساعدة": "Help Center",
  "من نحن": "About Company",
  "دعوة الأصدقاء": "Refer Friends",
  "تعديل كلمة مرور تسجيل الدخول": "Change Login Pass",
  "تعديل كلمة مرور الدفع": "Change Pay Pass",
  "تسجيل الخروج": "Log Out",
  "خروج": "Log Out",
  "موضع": "Position",
  "رصيد الحساب": "Account Assets",
  "مبلغ العقد المتاح": "Contract Balance",
  "البريد الإلكتروني للشركة:": "Company Email:",
  "خدمة العملاء": "Support Helpdesk",
  "تفاصيل الصندوق": "Vault History",
  "تفاصيل الدخل": "P&L Earnings",
  "إعادة التعبئة": "Recharge Up",
  "اكسب عمولة": "Earn Commission",
  "الدفع الفوري": "Direct Remit",
  "صندوق هدايا": "Perks Ledger",
  "سجلات الحسابات": "Ledger Accounts",
  "تغيير كلمة المرور": "Change Credentials",
  "تغيير كلمة المرور للصناديق": "Change Security PIN",
  "تنزيل التطبيق": "Get Android APP",

  // Recharge / Withdraw
  "الرجاء اختيار أو إدخال المبلغ": "Choose or enter top up amount",
  "قناة إعادة الشحن": "Payment Channel",
  "مبلغ الشحن الموصى به: 50.00$ - 7200.00$": "Recommended top up: $50.00 - $7200.00",
  "إعادة شحن فوري": "Instant Deposit",
  "مبلغ السحب": "Withdrawal Value",
  "الرجاء إدخال مبلغ السحب": "Please write how much you want to cashout",
  "ملاحظات مهمة: الحد الأدنى للسحب 5$ - الوقت المستغرق 10 دقائق": "Notes: Min cashout $5 - Duration: 10 mins",
  "أرسل": "Submit Request",
  "الرجاء إدخال كلمة مرور الدفع": "Enter your security key",

  // Income / Reports
  "إجمالي الأرباح": "Accumulated Profits",
  "الأرباح المجمدة": "Locked Balance",
  "رصيد الشحن": "Recharge Assets",
  "تقرير الدخل": "P&L Statements",
  "نوع المعاملة": "Payment Spec",
  "الحجم": "Grand Total",
  "الحالة": "Progress Indicator",
  "إجمالي الدخل اليوم": "Total Income Today",
  "دخل العمل اليوم": "Work Income Today",
  "دخل الفريق اليوم": "Team Income Today",
  "إجمالي الإيرادات أمس": "Total Income Yesterday",
  "إجمالي الدخل هذا الشهر": "Total Income This Month",

  // Rewards Page
  "تفاصيل التمويل": "Financial Statements",
  "مكافآت الترويج للعمل": "Referral Dividends",

  // Help & About
  "بشأن": "About Us",
  "مساعدة": "F.A.Q",

  // Customer Service & Chat
  "الخط الساخن لخدمة العملاء": "Customer Hotline Helpdesk",
  "تواصل معنا": "Chat with Help Desk",

  // Share Referral Page
  "رقم الدعوة:": "Inviation Code:",
  "رابط الدعوة:": "Referral Link:",
  "نسخ": "Copy Text",
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("stackmall_lang");
    return (saved === "en" || saved === "ar" ? saved : "ar") as Language;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("stackmall_lang", lang);
  };

  const t = (key: string, enText?: string): string => {
    if (language === "ar") {
      return key;
    }
    // If English, lookup in map
    const trimmed = key.trim();
    if (translationMap[trimmed]) {
      return translationMap[trimmed];
    }
    // Clean potential spaces/symbols
    const cleaned = trimmed.replace(/[.٫:]/g, "").trim();
    if (translationMap[cleaned]) {
      return translationMap[cleaned];
    }

    if (enText) {
      return enText;
    }

    // fallback or basic auto transforms if key is english word
    return key;
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    // Update document HTML language attribute and direction for screen readers/responsive flows
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [dir, language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
