import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import {
  ShieldAlert,
  Users,
  Coins,
  FileCheck,
  Check,
  X,
  CreditCard,
  Plus,
  Trash2,
  RefreshCw,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Search,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  UserCheck,
  TrendingDown
} from "lucide-react";
import {
  getSimulatedUsers,
  updateSimulatedUsers,
  getSimulatedTransactions,
  updateSimulatedTransactions,
  modifyUserExpiredStatus,
  modifyUserBalance,
  buyPackage,
  SimulatedUser,
  SimulatedTransaction
} from "../utils/user";
import { useTranslation } from "../context/LanguageContext";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { t, language, dir, setLanguage } = useTranslation();

  // Authentication states (Safe verification, hidden credentials)
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [securityPinInput, setSecurityPinInput] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Tab State
  const [activeTab, setActiveTab] = useState<"users_list" | "withdrawal_requests" | "recharge_requests" | "manual_funding">("users_list");

  // System states
  const [users, setUsers] = useState<SimulatedUser[]>([]);
  const [transactions, setTransactions] = useState<SimulatedTransaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  // Manual Add Balance State
  const [selectedUserId, setSelectedUserId] = useState("");
  const [manualAmount, setManualAmount] = useState("");
  const [manualType, setManualType] = useState<"add" | "set">("add");

  // Check existing session from Supabase to prevent localStorage bypass
  useEffect(() => {
    const verifyAdminAccess = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData?.session?.user) {
          const { data: userData, error } = await supabase
            .from('app_users')
            .select('role')
            .eq('id', sessionData.session.user.id)
            .single();
            
          if (!error && userData?.role === 'admin') {
            setIsAuthorized(true);
            loadSystemData();
            return;
          }
        }
        
        // If not authenticated via Supabase as admin, block access
        setIsAuthorized(false);
      } catch (err) {
        setIsAuthorized(false);
      }
    };

    verifyAdminAccess();
  }, []);

  // Track and update activity to implement exact departure timeout
  useEffect(() => {
    if (!isAuthorized) return;

    localStorage.setItem("admin_last_activity", Date.now().toString());

    const updateActivity = () => {
      localStorage.setItem("admin_last_activity", Date.now().toString());
    };

    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"];
    events.forEach((eventName) => {
      window.addEventListener(eventName, updateActivity);
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        localStorage.setItem("admin_last_activity", Date.now().toString());
      } else {
        const lastActive = localStorage.getItem("admin_last_activity");
        if (lastActive) {
          const timeDiff = Date.now() - Number(lastActive);
          const tenMinutes = 10 * 60 * 1000;
          if (timeDiff > tenMinutes) {
            handleLogout();
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    const interval = setInterval(updateActivity, 10000); // update every 10 seconds

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, updateActivity);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(interval);
      // Save last departure timestamp upon leaving the page component
      localStorage.setItem("admin_last_activity", Date.now().toString());
    };
  }, [isAuthorized]);

  const loadSystemData = async () => {
    // Attempt to fetch live data directly from Supabase, RLS policies will ensure only admin can read all
    try {
      const { data: liveUsers, error: usersErr } = await supabase.from('app_users').select('*');
      const { data: liveTxs, error: txsErr } = await supabase.from('app_transactions').select('*');
      
      if (liveUsers && !usersErr) {
        const mappedUsers = liveUsers.map(u => ({
          id: u.id.toString(),
          email: u.email,
          regDate: u.reg_date || new Date().toISOString(),
          isActive: u.is_active || false,
          packageBought: u.package_bought || "",
          withdrawalsCount: u.withdrawals_count || 0,
          rechargesCount: u.recharges_count || 0,
          balance: Number(u.balance) || 0,
          contractBalance: Number(u.contract_balance) || 0,
          lastActivity: u.last_activity || "نشط الآن",
          isExpired: u.is_expired || false,
          phone: u.phone,
          referredBy: u.referred_by,
          hasCompletedTraining: u.has_completed_training || false
        }));
        setUsers(mappedUsers);
      } else {
        setUsers(getSimulatedUsers());
      }

      if (liveTxs && !txsErr) {
        const mappedTxs = liveTxs.map(t => ({
          id: t.id.toString(),
          userId: t.user_id?.toString() || "10001",
          type: t.type as "deposit" | "withdraw",
          amount: Number(t.amount) || 0,
          status: t.status as any,
          date: t.timestamp || new Date().toISOString(),
          network: t.network,
          address: t.wallet
        }));
        setTransactions(mappedTxs);
      } else {
        setTransactions(getSimulatedTransactions());
      }
      return;
    } catch (err) {
      console.error("Live fetch failed", err);
    }
    
    // Fallback if not admin or fetch fails
    setUsers(getSimulatedUsers());
    setTransactions(getSimulatedTransactions());
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      const email = emailInput.trim().toLowerCase();
      let authData = null;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: passwordInput,
      });

      if (error) {
        // Auto-signup and make super-admin for the primary owner email if not found
        if (email === "hamozasalom@gmail.com") {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: email,
            password: passwordInput,
          });
          
          if (signUpError) {
             setLoginError("المعلومات المدخلة غير صحيحة. حساب مدير النظام موجود مسبقاً، يرجى التأكد من كلمة المرور.");
             return;
          }
          authData = signUpData;
          // small delay to allow supabase auth triggers to populate public.app_users
          await new Promise(res => setTimeout(res, 800));
        } else {
          setLoginError("المعلومات المدخلة غير صحيحة. تأكد من البريد وكلمة المرور.");
          return;
        }
      } else {
        authData = data;
      }

      if (authData?.user) {
        // Enforce the Super Admin promotion in DB
        if (email === "hamozasalom@gmail.com") {
           await supabase.from('app_users').upsert({
              id: authData.user.id,
              email: authData.user.email,
              role: 'admin'
           }, { onConflict: 'id' });
        }

        // Fetch user from DB
        const { data: userData, error: userError } = await supabase
          .from('app_users')
          .select('role')
          .eq('id', authData.user.id)
          .single();

        if (userError || userData?.role !== 'admin') {
          setLoginError("عذراً، هذا الحساب لا يملك صلاحيات الإدارة.");
          await supabase.auth.signOut();
          return;
        }

        if (email === "hamozasalom@gmail.com" && securityPinInput.trim() !== "103209") {
           setLoginError("الرمز السري الخاص بالمدير غير صحيح.");
           await supabase.auth.signOut();
           return;
        } else if (!securityPinInput || securityPinInput.trim() === '') {
           setLoginError("الرجاء إدخال الرمز السري.");
           await supabase.auth.signOut();
           return;
        }

        sessionStorage.setItem("admin_logged_in", "true");
        localStorage.setItem("admin_logged_in", "true");
        localStorage.setItem("admin_last_activity", Date.now().toString());
        setIsAuthorized(true);
        loadSystemData();
        triggerFeedback("تم التحقق وتسجيل الدخول كمدير للنظام بنجاح!");
      }
    } catch (err) {
      setLoginError("حدث خطأ أثناء تسجيل الدخول");
    }
  };

  const triggerFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(""), 4500);
  };

  const handleLogout = async () => {
    sessionStorage.removeItem("admin_logged_in");
    localStorage.removeItem("admin_logged_in");
    localStorage.removeItem("admin_last_activity");
    await supabase.auth.signOut();
    setIsAuthorized(false);
  };

  // Feature 1: Mark user as Expired ("منتهي الصلاحية")
  const handleToggleExpired = (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;
    
    const newStatus = !targetUser.isExpired;
    modifyUserExpiredStatus(userId, newStatus);
    loadSystemData();
    triggerFeedback(`تم تعديل حالة حساب العميل ${userId} إلى: ${newStatus ? 'منتهي الصلاحية' : 'نشط مسموح به'}`);
  };

  // Feature 2: Approve / Reject Withdrawal requests
  const handleProcessWithdrawal = (txId: string, action: "approve" | "reject") => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx || tx.type !== "withdraw" || tx.status !== "pending") return;

    const userList = getSimulatedUsers();
    const userIndex = userList.findIndex(u => u.id === tx.userId);

    if (action === "approve") {
      if (userIndex === -1) {
        triggerFeedback("خطأ: المستخدم صاحب الطلب غير موجود!");
        return;
      }

      const client = userList[userIndex];
      if (client.balance < tx.amount) {
        triggerFeedback(`خطأ: رصيد المستخدم الحالي $${client.balance} أقل من المبلغ المطلوب سحبه $${tx.amount}!`);
        return;
      }

      // Deduct balance automatically and record withdrawal count
      client.balance -= tx.amount;
      client.withdrawalsCount += 1;
      userList[userIndex] = client;
      updateSimulatedUsers(userList);
    }

    // Update Transaction status
    const updatedTxs = transactions.map(t => {
      if (t.id === txId) {
        return { ...t, status: action === "approve" ? "approved" as const : "rejected" as const };
      }
      return t;
    });

    updateSimulatedTransactions(updatedTxs);
    loadSystemData();
    triggerFeedback(action === "approve" ? `تمت الموافقة على طلب السحب بنجاح وخصم $${tx.amount} من حسابه!` : `تم رفض طلب السحب.`);
  };

  // Feature 3: Approve / Reject Recharge (deposit) requests
  const handleProcessRecharge = (txId: string, action: "approve" | "reject") => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx || tx.type !== "deposit" || tx.status !== "pending") return;

    if (action === "approve") {
      const userList = getSimulatedUsers();
      const userIndex = userList.findIndex(u => u.id === tx.userId);

      if (userIndex !== -1) {
        const client = userList[userIndex];
        // Credit the balance automatically
        client.balance += tx.amount;
        client.rechargesCount += 1;
        client.isActive = true; // Auto mark as recharged user if they subscribed
        userList[userIndex] = client;
        updateSimulatedUsers(userList);
      }
    }

    // Update transaction status
    const updatedTxs = transactions.map(t => {
      if (t.id === txId) {
        return { ...t, status: action === "approve" ? "approved" as const : "rejected" as const };
      }
      return t;
    });

    updateSimulatedTransactions(updatedTxs);
    loadSystemData();
    triggerFeedback(action === "approve" ? `تم تأكيد التحويل بنجاح، وتمت إضافة $${tx.amount} لحساب العميل!` : `تم رفض طلب الشحن.`);
  };

  // Feature 4: Handle Manual Added Balance
  const handleApplyManualFunding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      triggerFeedback("الرجاء إدخال رقم المستخدم أو بريده الإلكتروني");
      return;
    }
    const amtNum = parseFloat(manualAmount);
    if (isNaN(amtNum) || amtNum <= 0) {
      triggerFeedback("الرجاء إدخال مبلغ صحيح لإعادة الهيكلة");
      return;
    }

    const userList = getSimulatedUsers();
    const query = selectedUserId.trim().toLowerCase();
    const userIndex = userList.findIndex(u => u.id.toLowerCase() === query || u.email.toLowerCase() === query);
    
    if (userIndex === -1) {
      triggerFeedback("حساب المستخدم غير موجود! تأكد من الرقم التسلسلي أو البريد.");
      return;
    }

    const client = userList[userIndex];
    if (manualType === "add") {
      client.balance += amtNum;
      triggerFeedback(`تم بنجاح إضافة مبلغ $${amtNum} إلى حساب العميل ${client.id}`);
    } else {
      client.balance = amtNum;
      triggerFeedback(`تم بنجاح ضبط رصيد العميل ${client.id} إلى $${amtNum}`);
    }

    userList[userIndex] = client;
    updateSimulatedUsers(userList);
    setManualAmount("");
    setSelectedUserId("");
    loadSystemData();
  };

  const handleDeleteTx = (id: string) => {
    const filtered = transactions.filter(t => t.id !== id);
    updateSimulatedTransactions(filtered);
    loadSystemData();
    triggerFeedback("تم حذف سجل المعاملة نهائياً من الذاكرة!");
  };

  // Filter users based on query
  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase();
    return u.id.includes(q) || u.email.toLowerCase().includes(q) || (u.packageBought || "").toLowerCase().includes(q);
  });

  // Filter active/funded users for Tab 4
  const fundedUsers = users.filter(u => u.isActive || u.balance > 0);

  // Filter pending transactions
  const pendingRecharges = transactions.filter(t => t.type === "deposit" && t.status === "pending");
  const pendingWithdrawals = transactions.filter(t => t.type === "withdraw" && t.status === "pending");

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4 font-sans relative" dir="rtl">
        <div className="bg-white border border-gray-200/90 rounded-2xl w-full max-w-[420px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] relative z-10 text-right">
          <div className="flex flex-col items-center mb-6">
            <div className="w-[60px] h-[60px] bg-sky-50 rounded-full flex items-center justify-center mb-3 border border-sky-100/85 text-blue-600">
              <ShieldAlert size={30} />
            </div>
            <h1 className="text-gray-900 text-[20px] font-bold tracking-tight">لوحة تحكم المسؤول</h1>
            <p className="text-gray-550 text-xs mt-1 text-center font-medium">
               نظام إدارة المتجر ومراقبة المعاملات
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-xs font-bold mb-1.5">البريد الإلكتروني للادمن</label>
              <input
                type="email"
                required
                autoComplete="off"
                placeholder=""
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg h-[44px] px-3 outline-none text-gray-900 text-[13.5px] font-mono text-left focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                style={{ direction: "ltr" }}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-xs font-bold mb-1.5">كلمة سر الإدارة</label>
              <input
                type="password"
                required
                autoComplete="new-password"
                placeholder=""
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg h-[44px] px-3 outline-none text-gray-900 text-[13.5px] font-mono text-left focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                style={{ direction: "ltr" }}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-xs font-bold mb-1.5">الرمز السري الخاص بالتحقق (Pin)</label>
              <input
                type="password"
                maxLength={6}
                required
                autoComplete="off"
                placeholder=""
                value={securityPinInput}
                onChange={(e) => setSecurityPinInput(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg h-[44px] px-3 outline-none text-gray-900 text-[14px] font-mono tracking-widest text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                style={{ direction: "ltr" }}
              />
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg text-center font-bold leading-relaxed">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer text-white rounded-lg h-[44px] font-bold text-[14.5px] transition-all mt-4 hover:shadow-md active:scale-95"
            >
              تحقق وتسجيل الدخول للمخدم
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col xl:flex-row" dir="rtl">
      
      {/* SIDEBAR NAVIGATION - WHITE CLASSIC WORKSPACE */}
      <aside className="w-full xl:w-[280px] bg-white text-slate-800 shrink-0 shadow-sm border-l border-gray-200 flex flex-col">
        {/* Admin Branding Brand */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-center">
              S
            </div>
            <div>
              <span className="font-bold text-[15px] block text-slate-900 leading-tight">StackMall Admin</span>
              <span className="text-[10px] text-green-600 font-bold tracking-wider font-mono">SECURE ACC LEVEL-1</span>
            </div>
          </div>
        </div>

        {/* Navigation Sidebar Lists */}
        <nav className="p-3 flex-1 space-y-1">
          {/* USER DATABASE BUTTON */}
          <button
            onClick={() => setActiveTab("users_list")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "users_list" 
                ? "bg-blue-600 text-white shadow-sm" 
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Users size={16} />
            <span>صفحة المستخدمين ({users.length})</span>
          </button>

          {/* RECHARGE REQUESTS TAB */}
          <button
            onClick={() => setActiveTab("recharge_requests")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "recharge_requests" 
                ? "bg-blue-600 text-white shadow-sm" 
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <Plus size={16} />
              <span>إعادة الشحن (الودائع)</span>
            </div>
            {pendingRecharges.length > 0 && (
              <span className="bg-green-600 text-white font-mono text-[10px] px-2 py-0.5 rounded-full font-bold">
                {pendingRecharges.length}
              </span>
            )}
          </button>

          {/* WITHDRAWAL REQUESTS TAB */}
          <button
            onClick={() => setActiveTab("withdrawal_requests")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "withdrawal_requests" 
                ? "bg-blue-600 text-white shadow-sm" 
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <TrendingDown size={16} />
              <span>السحوبات المطلوبة</span>
            </div>
            {pendingWithdrawals.length > 0 && (
              <span className="bg-orange-600 text-white font-mono text-[10px] px-2 py-0.5 rounded-full font-bold">
                {pendingWithdrawals.length}
              </span>
            )}
          </button>

          {/* MANUAL OVERRIDE DEPOSIT */}
          <button
            onClick={() => setActiveTab("manual_funding")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "manual_funding" 
                ? "bg-blue-600 text-white shadow-sm" 
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Coins size={16} />
            <span>شحن يدوي للنشطين</span>
          </button>
        </nav>

        {/* Global Control Stats / Logout Action */}
        <div className="p-3 border-t border-gray-200 space-y-2 mt-auto">
          <div className="bg-gray-50 p-2.5 rounded-lg text-center border border-gray-100">
            <span className="text-[10px] text-gray-500 font-medium block">المشرف النشط حالياً</span>
            <span className="text-xs font-bold text-slate-800 block truncate">hamozasalom@gmail.com</span>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-all cursor-pointer border border-red-205"
          >
            <LogOut size={14} />
            <span>تسجيل الخروج من النظام</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER WORKSPACE */}
      <main className="flex-1 flex flex-col pb-12 overflow-x-hidden md:px-6">
        
        {/* TOP STATUS BAR STRIP */}
        <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 mb-6 shrink-0 shadow-xs rounded-b-xl">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></div>
            <span className="text-xs font-bold text-gray-550">مزامنة مخدم الذاكرة المحلية (لوحة محترفة للحاسوب): متصل</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
            <div>التوقيت الحالي: <span className="font-mono font-bold text-gray-800">{new Date().toLocaleDateString('en-CA')}</span></div>
          </div>
        </header>

        {/* FLOAT NOTIFICATION ALERT SCREEN */}
        {feedbackMsg && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] max-w-[90%] bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-xl flex items-center gap-2 text-xs transition-all animate-bounce">
            <CheckCircle size={16} className="text-green-300 font-semibold" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* ACTION TABS CONTENT ROUTING */}
        <div className="px-4 md:px-0">
          
          {/* Tab 1: قائمة المستخدمين الشاملة */}
          {activeTab === "users_list" && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                <div>
                  <h2 className="text-[17px] font-bold text-gray-900 flex items-center gap-2">
                    <Users size={20} className="text-blue-600" />
                    سجل جميع المستخدمين لـ StackMall
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                     رصد كامل معلومات المستخدمين وترتيبهم ومدة نشاطهم مع ميزة التحكم بالصلاحية
                  </p>
                </div>

                {/* Database Search box */}
                <div className="relative w-full sm:max-w-[280px]">
                  <input
                    type="text"
                    placeholder="ابحث برقم المستخدم او بريده..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-lg pl-3 pr-9 h-[36px] text-xs outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <Search size={14} className="text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-right border-collapse text-xs">
                  <thead className="bg-slate-50 text-gray-700 font-bold border-b border-gray-200">
                    <tr>
                      <th className="p-3">الرقم التسلسلي (ID)</th>
                      <th className="p-3">البريد الإلكتروني</th>
                      <th className="p-3">تاريخ التسجيل</th>
                      <th className="p-3">الحساب مشحون؟</th>
                      <th className="p-3">الباقة المشترك بها</th>
                      <th className="p-3">مرات الشحن</th>
                      <th className="p-3">مرات السحب</th>
                      <th className="p-3">الرصيد المتاح</th>
                      <th className="p-3">آخر تواصل</th>
                      <th className="p-3 text-center">أمر التحكم بالصلاحية</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="p-8 text-center text-gray-400 font-medium font-sans">
                          لا توجد نتائج تطابق استعلام البحث الموفر!
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((client) => {
                        return (
                          <tr key={client.id} className={`hover:bg-slate-50/50 transition-colors ${client.isExpired ? 'bg-red-50/30' : ''}`}>
                            <td className="p-3 font-mono font-bold text-blue-600">
                              {client.id}
                              {client.isExpired && (
                                <span className="mr-1 inline-block bg-red-100 text-red-700 font-bold text-[8.5px] px-1.5 py-0.5 rounded">
                                  منتهي الصلاحية
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-gray-600 font-mono">{client.email}</td>
                            <td className="p-3 text-gray-500 font-mono">{client.regDate}</td>
                            <td className="p-3">
                              <span className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${
                                client.isActive 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {client.isActive ? 'مشحون ✔️' : 'غير مشحون ❌'}
                              </span>
                            </td>
                            <td className="p-3 font-bold text-gray-900 font-mono">{client.packageBought || 'لا يوجد'}</td>
                            <td className="p-3 font-semibold font-mono">{client.rechargesCount}</td>
                            <td className="p-3 font-semibold font-mono">{client.withdrawalsCount}</td>
                            <td className="p-3 font-bold font-mono text-green-600">${client.balance.toFixed(2)}</td>
                            <td className="p-3 text-gray-500">{client.lastActivity}</td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => handleToggleExpired(client.id)}
                                className={`px-2.5 py-1.5 rounded-lg font-bold text-[10.5px] cursor-pointer transition-all ${
                                  client.isExpired 
                                    ? 'bg-slate-100 text-gray-700 hover:bg-slate-200' 
                                    : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                                }`}
                              >
                                {client.isExpired ? 'إلغاء وضع الانتهاء' : 'منتهي الصلاحية'}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: طلبات السحب المعلقة */}
          {activeTab === "withdrawal_requests" && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
              <div>
                <h2 className="text-[17px] font-bold text-gray-900 flex items-center gap-2">
                  <TrendingDown size={20} className="text-orange-600" />
                  أمان وطلبات سحب الأموال الحالية
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                   الحد الأدنى المسموح به للعميل لتقديم طلب سحب هو ٩ دولار. الموافقة تقوم بتنقيص الرصيد تلقائياً.
                </p>
              </div>

              {pendingWithdrawals.length === 0 ? (
                <div className="text-center p-12 border border-dashed border-gray-200 rounded-xl bg-slate-50">
                  <div className="text-gray-400 mb-2">🎉</div>
                  <p className="text-xs text-gray-500 font-semibold">لا يوجد أي طلبات سحب معلقة حالياً للإثبات والمعالجة!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingWithdrawals.map((tx) => {
                    const client = users.find(u => u.id === tx.userId);
                    return (
                      <div key={tx.id} className="border border-gray-200 bg-slate-50/50 rounded-xl p-4 flex flex-col gap-3 shadow-xs">
                        <div className="flex items-center justify-between border-b border-gray-250 pb-2">
                          <span className="font-mono text-gray-400 font-bold">{tx.id}</span>
                          <span className="bg-orange-100 text-orange-900 font-bold py-0.5 px-2 rounded-full text-[10px]">
                             طلب سحب
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>المستخدم (ID): <span className="font-bold text-gray-900 font-mono">{tx.userId}</span></div>
                          <div>بريده الموثق: <span className="font-mono text-gray-650">{client?.email || 'غير معروف'}</span></div>
                          <div>رقم جواله / حسابه: <span className="font-mono text-[#1975e5] font-bold">{client?.phone || 'غير مسجل أو غير متاح'}</span></div>
                          <div>رصيد العميل الحالي: <span className="font-bold text-green-600 font-mono">${(client?.balance || 0).toFixed(2)}</span></div>
                          <div>مبلغ السحب المطلوب: <span className="font-bold text-red-600 font-mono text-sm">${tx.amount.toFixed(2)}</span></div>
                          <div>كلمة مرور السحب: <span className="font-bold text-purple-600 font-mono">{tx.txPassword || client?.transactionPassword || 'غير معينة'}</span></div>
                          <div className="col-span-2 border-t border-slate-200 pt-1.5 mt-0.5">
                             العنوان المحول إليه (عنوان المحفظة): <span className="font-mono text-[11px] text-gray-700 block mt-1 break-all bg-white p-1.5 rounded border border-gray-200 font-semibold">{tx.address || client?.walletAddress || 'غير محدد'}</span>
                          </div>
                        </div>

                        <div className="flex gap-2.5 mt-2.5 border-t border-gray-200 pt-2.5">
                          <button
                            onClick={() => handleProcessWithdrawal(tx.id, "approve")}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer transition-all"
                          >
                            <Check size={14} strokeWidth={2.5} />
                            <span>موافقة (تلقائي الخصم)</span>
                          </button>
                          <button
                            onClick={() => handleProcessWithdrawal(tx.id, "reject")}
                            className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer transition-all"
                          >
                            <X size={14} strokeWidth={2.5} />
                            <span>رفض السحب للعميل</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: طلبات الشحن المعلقة */}
          {activeTab === "recharge_requests" && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
              <div>
                <h2 className="text-[17px] font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-600" />
                  مراجعة طلبات إعادة الشحن وإثباتات الدفع (USDT Rigs)
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                   العملاء يرسلون الإثباتات (لقطات الشاشة كصور) من محفظتهم لتأكيد الدفع. تأكد منها ومصادقتها لتزويد رصيدهم تلقائياً.
                </p>
              </div>

              {pendingRecharges.length === 0 ? (
                <div className="text-center p-12 border border-dashed border-gray-200 rounded-xl bg-slate-50">
                  <div className="text-gray-400 mb-2">✔️</div>
                  <p className="text-xs text-gray-500 font-semibold">لا يوجد أي إيداعات قيد المراجعة المعلقة حالياً!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRecharges.map((tx) => {
                    const client = users.find(u => u.id === tx.userId);
                    return (
                      <div key={tx.id} className="border border-gray-200 rounded-xl p-4 bg-slate-50/50 flex flex-col lg:flex-row gap-5 shadow-xs">
                        
                        {/* Transaction and User specifics */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                            <span className="font-mono text-gray-450 font-bold">{tx.id}</span>
                            <span className="bg-green-105 text-green-800 font-bold py-0.5 px-2 rounded-full text-[10px]">
                              شحن رصيد - USDT BEP20
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-xs leading-relaxed">
                            <div>رقم العميل (ID): <span className="font-bold text-gray-900 font-mono">{tx.userId}</span></div>
                            <div>البريد المسجل: <span className="font-mono text-gray-600">{client?.email || 'غير معروف'}</span></div>
                            <div>المبلغ المزعوم تحويله: <span className="font-bold text-green-600 font-mono text-sm">${tx.amount.toFixed(2)}</span></div>
                            <div>رصيده المتاح للتداول: <span className="font-semibold font-mono text-gray-600">${(client?.balance || 0).toFixed(2)}</span></div>
                            <div className="col-span-2">تاريخ الإرسال: <span className="font-mono text-gray-500">{tx.date}</span></div>
                          </div>

                          <div className="flex gap-2 mt-4 pt-2 border-t border-gray-200">
                            <button
                                onClick={() => handleProcessRecharge(tx.id, "approve")}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer transition-all shadow-sm"
                            >
                              <Check size={14} strokeWidth={2.5} />
                              <span>تأكيد الإيداع (إضافة رصيد تلقائي)</span>
                            </button>
                            <button
                              onClick={() => handleProcessRecharge(tx.id, "reject")}
                              className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer transition-all shadow-sm"
                            >
                              <X size={14} strokeWidth={2.5} />
                              <span>رفض طلب الشحن</span>
                            </button>
                          </div>
                        </div>

                        {/* Image proof uploader visual display */}
                        <div className="w-full lg:w-[260px] flex flex-col items-center justify-center border border-gray-200 rounded-lg bg-white p-2 shrink-0 shadow-xs">
                           <span className="text-[10px] font-bold text-gray-500 mb-1.5">صورة تأكيد الدفع المرسلة:</span>
                           {tx.proofImage ? (
                             <a href={tx.proofImage} target="_blank" rel="noreferrer" title="اضغط لفتح الصورة بحجم كلي">
                               <img 
                                 src={tx.proofImage} 
                                 alt="Receipt Proof" 
                                 className="max-h-[150px] w-auto rounded object-contain border border-gray-250 shadow-sm hover:scale-105 transition-transform" 
                               />
                             </a>
                           ) : (
                             <div className="h-[120px] bg-slate-50 rounded flex items-center justify-center w-full text-center text-gray-400 font-medium text-[10.5px]">
                               لم يرفق المستخدم أي إثبات مصور!
                             </div>
                           )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab 4: شحن يدوي للنشطين */}
          {activeTab === "manual_funding" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              
              {/* Form Manual adding */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4 lg:col-span-1 h-fit">
                <div>
                  <h3 className="text-[15px] font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                    <Plus size={16} className="text-blue-600" />
                    شحن يدوي لحسابات العملاء
                  </h3>
                  <p className="text-[11.5px] text-gray-500 mt-1">
                     قم باختيار العميل من جدول اليمين ثم خصص المبلغ الذي تود زيادته يدوياً فوراً.
                  </p>
                </div>

                <form onSubmit={handleApplyManualFunding} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1.5">أدخل رقم المستخدم أو بريده الإلكتروني:</label>
                    <input
                      type="text"
                      required
                      placeholder="اضغط على المستخدم من القائمة أو اكتب بريده هنا"
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 text-xs text-center font-bold text-blue-600 font-sans outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1.5">طريقة الإجراء التمويلي:</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setManualType("add")}
                        className={`py-1.5 px-3 rounded-lg font-bold border transition ${
                          manualType === "add" 
                            ? 'bg-blue-50 border-blue-200 text-blue-700' 
                            : 'border-gray-200 text-gray-600 hover:bg-slate-50'
                        }`}
                      >
                         إضافة للموجود (+)
                      </button>
                      <button
                        type="button"
                        onClick={() => setManualType("set")}
                        className={`py-1.5 px-3 rounded-lg font-bold border transition ${
                          manualType === "set" 
                            ? 'bg-blue-50 border-blue-200 text-blue-700' 
                            : 'border-gray-200 text-gray-600 hover:bg-slate-50'
                        }`}
                      >
                         ضبط فوري للرصيد (=)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1.5">مبلغ العملية (USD):</label>
                    <input
                      type="number"
                      required
                      placeholder="صيغة مالية رقمية"
                      value={manualAmount}
                      onChange={(e) => setManualAmount(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 text-xs text-center font-mono font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-xs transition active:scale-95 cursor-pointer text-center shadow-xs"
                  >
                     تنفيذ وزيادة الرصيد فوراً
                  </button>
                </form>
              </div>

              {/* Table list of funded users containing active package or balance */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4 lg:col-span-2">
                <div>
                  <h3 className="text-[15.5px] font-bold text-gray-900">
                     المستخدمون النشطون (أصحاب الباقات أو لديهم رصيد)
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                     اضغط على اسم أو رقم أي مستخدم من الجدول أدناه لتحديده والشحن يدوياً له.
                  </p>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 text-gray-600 font-bold border-b border-gray-200">
                      <tr>
                        <th className="p-3">رقم المستخدم</th>
                        <th className="p-3">بريده الإلكتروني</th>
                        <th className="p-3">باقة الاشتراك المشتراة</th>
                        <th className="p-3">الرصيد المتاح حالياً</th>
                        <th className="p-3">مبلغ العقد</th>
                        <th className="p-3 text-center">الإجراء المباشر</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {fundedUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-gray-400">
                             لم يتم شحن أي باقة حالياً للعملاء الجدد!
                          </td>
                        </tr>
                      ) : (
                        fundedUsers.map(u => (
                          <tr 
                            key={u.id} 
                            onClick={() => setSelectedUserId(u.id)}
                            className={`cursor-pointer transition hover:bg-slate-50 ${selectedUserId === u.id ? 'bg-blue-50/70' : ''}`}
                          >
                            <td className="p-3 font-mono font-bold text-blue-600">#{u.id}</td>
                            <td className="p-3 text-gray-600 font-mono">{u.email}</td>
                            <td className="p-3"><span className="bg-blue-50 text-blue-750 px-2 py-0.5 rounded font-bold">{u.packageBought || 'بدون باقة'}</span></td>
                            <td className="p-3 font-bold text-green-600 font-mono">${u.balance.toFixed(2)}</td>
                            <td className="p-3 font-bold text-blue-600 font-mono">${u.contractBalance.toFixed(2)}</td>
                            <td className="p-3 text-center">
                              <span className="text-blue-600 underline font-bold hover:text-blue-700 text-[11px]">
                                تحديد للشحن اليدوي
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}
