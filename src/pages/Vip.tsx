import { useState, useEffect } from "react";
import { useTranslation } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { 
  getSimulatedUsers, 
  updateSimulatedUsers, 
  getUserBalance, 
  getUserContractBalance 
} from "../utils/user";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ShoppingCart, 
  Truck, 
  Package, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  User, 
  Phone, 
  Wallet, 
  Check, 
  ArrowLeftRight,
  Loader,
  Image
} from "lucide-react";

// Package details map matching Mall.tsx memberships
const PACKAGES: Record<string, { name: string; price: number; daily_income: number }> = {
  "ST-1": { name: "ST-1", price: 50.0, daily_income: 2.0 },
  "ST-2": { name: "ST-2", price: 150.0, daily_income: 6.0 },
  "ST-3": { name: "ST-3", price: 450.0, daily_income: 18.0 },
  "ST-4": { name: "ST-4", price: 1440.0, daily_income: 60.0 },
  "ST-5": { name: "ST-5", price: 3600.0, daily_income: 150.0 },
  "ST-6": { name: "ST-6", price: 7200.0, daily_income: 360.0 },
  "ST-7": { name: "ST-7", price: 14400.0, daily_income: 720.0 }
};

// Dictionary of 4 realistic products for each package level.
// Sum of prices under each package matches its exact contract price (ST-1: $50, ST-2: $150, ST-3: $450, etc.)
const PRODUCTS_BY_PACKAGE: Record<string, { id: string; name: string; price: number; img: string }[]> = {
  "ST-1": [
    {
      id: "st1-1",
      name: "خلاط إسبريسو كهربائي محمول وصانع رغوة الحليب السريع",
      price: 18.00,
      img: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "st1-2",
      name: "فرامة ومفرمة خضار كهربائية لاسلكية للمطبخ",
      price: 13.00,
      img: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e2?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "st1-3",
      name: "ميزان طعام مطبخ رقمي عالي الدقة بشاشة LCD",
      price: 11.00,
      img: "https://images.unsplash.com/photo-1603796846097-bee99e4a60c9?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "st1-4",
      name: "قاعدة تسخين أكواب القهوة والشاي الذكية للمكتب",
      price: 8.00,
      img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80"
    }
  ],
  "ST-2": [
    {
      id: "st2-1",
      name: "صانعة قهوة وتقطير ذكية رقمية من الفولاذ المقاوم للصدأ",
      price: 45.00,
      img: "https://images.unsplash.com/photo-1517256064527-09c53b2d0ec6?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "st2-2",
      name: "خلاط ومطحنة حبوب وتوابل جافة كهربائية محمولة",
      price: 30.00,
      img: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "st2-3",
      name: "مقلاة هوائية رقمية سعة ٥ لتر بخاصية اللمس والشواء السريع",
      price: 55.00,
      img: "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "st2-4",
      name: "غلاية مياه كهربائية سريعة التحضير مضادة للغليان الجاف",
      price: 20.00,
      img: "https://images.unsplash.com/photo-1594222082213-913a506eeaa2?auto=format&fit=crop&w=400&q=80"
    }
  ],
  "ST-3": [
    {
      id: "st3-1",
      name: "فرن ميكروويف منزلي ذكي بقوة ٩٠٠ واط مع مستشعر رطوبة يدوي",
      price: 120.00,
      img: "https://images.unsplash.com/photo-1585659610091-8f5ebba5ffbb?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "st3-2",
      name: "محضر طعام ومفرمة الخضار واللحوم متعددة الوظائف للمنزل",
      price: 90.00,
      img: "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "st3-3",
      name: "آلة تحضير الإسبريسو واللاتيه الاحترافية بضغط مضخة ١٥ بار الكلاسيكية",
      price: 180.00,
      img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "st3-4",
      name: "عصارة موالح وحمضيات كهربائية لترشيح اللب والتحضير المباشر",
      price: 60.00,
      img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80"
    }
  ],
  "ST-4": [
    {
      id: "st4-1",
      name: "مكنسة كهربائية روبوتية ذكية مع قاعدة تفريغ الأتربة التلقائي والملاحة",
      price: 380.00,
      img: "https://images.unsplash.com/photo-1518314916301-469f3a30c058?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "st4-2",
      name: "جهاز لتنقية هواء الغرفة المنزلي فلتر HEPA H13 ثلاثي الطبقات المعزز",
      price: 260.00,
      img: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "st4-3",
      name: "آلة تحضير القهوة والكبسولات المدمجة المتطورة لطحن الحبوب",
      price: 550.00,
      img: "https://images.unsplash.com/photo-1518057111178-44a106bad636?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "st4-4",
      name: "محضرة طعام وعجانة رأسية واقفة بهيكل ميكانيكي صلب للمخبوزات",
      price: 250.00,
      img: "https://images.unsplash.com/photo-1595166160877-e2311f9748ec?auto=format&fit=crop&w=400&q=80"
    }
  ],
  "ST-5": [
    {
      id: "st5-1",
      name: "ثلاجة ذكية مع فريزر مستقل ٤ أبواب بنظام تبريد وتدفق ثلاثي مبتكر",
      price: 1200.00,
      img: "https://images.unsplash.com/photo-1571175432244-9e735111747c?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "st5-2",
      name: "مكيف هواء سبليت ذكي موفر للطاقة بتقنية الانفيرتر الصديقة للبيئة",
      price: 950.00,
      img: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "st5-3",
      name: "غسالة أطباق ذكية مدمجة مع نظام تعقيم بالبخار وتجفيف مبرمج متكامل",
      price: 850.00,
      img: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "st5-4",
      name: "فرن كهربائي مدمج مع ميزة الشواية الهوائية ومروحة توربينية مزدوجة",
      price: 600.00,
      img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80"
    }
  ],
  "ST-6": [
    {
      id: "st6-1",
      name: "نظام طباخ حثي ذكي كامل للمطابخ وموقد حراري مدمج فاخر",
      price: 2200.00,
      img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "st6-2",
      name: "نظام توليد وتخزين الطاقة الشمسية المنزلية مع بطارية ليثيوم كبرى عملاقة",
      price: 1800.00,
      img: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "st6-3",
      name: "نظام تبريد وتدفئة مركزي ذكي متعدد الزونات والشرائح الموفرة الهوائية",
      price: 1500.00,
      img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "st6-4",
      name: "محطة إسبريسو مزدوجة الكبسولات وصانعة المشروبات الساخنة والباردة للمقاهي",
      price: 1700.00,
      img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80"
    }
  ],
  "ST-7": [
    {
      id: "st7-1",
      name: "غرفة تجميد وحفظ الأطعمة التجارية الكبرى للمستودعات الغذائية والفنادق",
      price: 4500.00,
      img: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "st7-2",
      name: "فرن مخبز ومصنع للمخبوزات والحلويات تجاري ذو طوابق متعددة مع تحكم رقمي",
      price: 3900.00,
      img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "st7-3",
      name: "نظام غسيل وتعقيم الأطباق والأواني الصناعي الضخم للمطاعم الكبرى والمنشآت العالمية",
      price: 3500.00,
      img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "st7-4",
      name: "محطة ونظام خلايا الطاقة الشمسية الهجين الخارق بقدرة ٢٠ كيلوواط للمزارع والمنشآت الضخمة",
      price: 2500.00,
      img: "https://images.unsplash.com/photo-1542332213-9b5a5a3f8c4c?auto=format&fit=crop&w=400&q=80"
    }
  ]
};


// Random customer detail lists for buying modal context
const CUSTOMERS = [
  { name: "عبد العزيز آل سعود", phone: "+966 50 **** 921", address: "الرياض، حي المربع، المملكة العربية السعودية" },
  { name: "أحمد العتيبي", phone: "+966 54 **** 350", address: "جدة، حي الحمراء، شارع فلسطين، السعودية" },
  { name: "سارة الشمري", phone: "+966 56 **** 782", address: "الدمام، حي الزهور، المنطقة الشرقية" },
  { name: "خالد المطيري", phone: "+966 55 **** 114", address: "مكة المكرمة، حي العزيزية، السعودية" }
];

const TABS_IDS = [
  "get_order",
  "buy_behalf",
  "unshipped",
  "shipped",
  "arrived"
];

export default function Vip() {
  const { t, dir } = useTranslation();
  
  const tabs = [
    { id: "get_order", label: t("الحصول على الطلب") },
    { id: "buy_behalf", label: t("الشراء نيابة عن الآخرين") },
    { id: "unshipped", label: t("غير مشحونة") },
    { id: "shipped", label: t("تم الشحن") },
    { id: "arrived", label: t("لقد وصلت البضائع") }
  ];
  const [activeTab, setActiveTab] = useState("get_order");
  const navigate = useNavigate();

  // User States
  const [userId, setUserId] = useState("10001");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userBalance, setUserBalanceVal] = useState(0);
  const [activePackage, setActivePackage] = useState<any>(null);

  // Workbench Engine State in localStorage
  const [claimed, setClaimed] = useState(false);
  const [claimedAtDate, setClaimedAtDate] = useState("");
  const [purchasedItems, setPurchasedItems] = useState<Record<string, boolean>>({});
  const [commissionEarned, setCommissionEarned] = useState(false);
  const [currentOrderState, setCurrentOrderState] = useState<"get_order" | "buy_behalf" | "unshipped" | "shipped" | "arrived">("get_order");
  const [allPurchasedAt, setAllPurchasedAt] = useState<number | null>(null);

  // Buy Modal state
  const [selectedBuyItem, setSelectedBuyItem] = useState<any>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);

  // General Notification Modals
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [grandSuccessMessage, setGrandSuccessMessage] = useState<string | null>(null);

  // Load User Data & Saved Task States
  const loadUserDataAndState = () => {
    const uid = localStorage.getItem("userId") || "10001";
    setUserId(uid);

    const usersList = getSimulatedUsers();
    const curr = usersList.find(u => u.id === uid);
    setCurrentUser(curr);

    if (curr) {
      setUserBalanceVal(curr.balance);
      
      // Determine active package
      const pkgId = curr.packageBought || "";
      if (curr.isActive && pkgId && PACKAGES[pkgId]) {
        setActivePackage({
          id: pkgId,
          ...PACKAGES[pkgId]
        });
      } else {
        setActivePackage(null);
      }
    }

    // Load Task state
    const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
    const savedStateStr = localStorage.getItem(`workbench_state_${uid}`);
    if (savedStateStr) {
      try {
        const parsed = JSON.parse(savedStateStr);
        // Load stored state without aggressively resetting just because date changed
        const loadedClaimed = parsed.claimed || false;
        const loadedClaimedAtDate = parsed.claimedAtDate || "";
        const loadedPurchasedItems = parsed.purchasedItems || {};
        const loadedCommissionEarned = parsed.commissionEarned || false;
        const loadedPurchasedAt = parsed.allPurchasedAt || null;
        let loadedStatus = parsed.status || "get_order";

        if (loadedPurchasedAt) {
          const hoursElapsed = (Date.now() - loadedPurchasedAt) / (1000 * 60 * 60);
          if (hoursElapsed >= 24) {
            loadedStatus = "arrived";
          } else if (hoursElapsed >= 6) {
            loadedStatus = "shipped";
          } else {
            loadedStatus = "unshipped";
          }
        }

        setClaimed(loadedClaimed);
        setClaimedAtDate(loadedClaimedAtDate);
        setPurchasedItems(loadedPurchasedItems);
        setCommissionEarned(loadedCommissionEarned);
        setAllPurchasedAt(loadedPurchasedAt);
        setCurrentOrderState(loadedStatus);
        
        if (loadedStatus && loadedStatus !== "arrived") {
          setActiveTab(loadedStatus);
        }
      } catch (e) {
        // clear corrupted
        localStorage.removeItem(`workbench_state_${uid}`);
      }
    } else {
      // Default initial states
      setClaimed(false);
      setClaimedAtDate("");
      setPurchasedItems({});
      setCommissionEarned(false);
      setAllPurchasedAt(null);
      setCurrentOrderState("get_order");
    }
  };

  useEffect(() => {
    loadUserDataAndState();
    // Add custom event listener for storage modifications
    window.addEventListener("storage", loadUserDataAndState);
    return () => {
      window.removeEventListener("storage", loadUserDataAndState);
    };
  }, []);

  // Poll for time-based order status updates
  useEffect(() => {
    if (!allPurchasedAt) return;

    const intervalId = setInterval(() => {
      const hoursElapsed = (Date.now() - allPurchasedAt) / (1000 * 60 * 60);
      let newStatus: typeof currentOrderState = "unshipped";
      if (hoursElapsed >= 24) {
        newStatus = "arrived";
      } else if (hoursElapsed >= 6) {
        newStatus = "shipped";
      }

      if (newStatus !== currentOrderState && newStatus !== "get_order" && newStatus !== "buy_behalf") {
        saveWorkbenchState(
          newStatus,
          claimed,
          claimedAtDate,
          purchasedItems,
          commissionEarned,
          allPurchasedAt
        );
      }
    }, 1000 * 60); // Check every minute

    return () => clearInterval(intervalId);
  }, [allPurchasedAt, currentOrderState, claimed, claimedAtDate, purchasedItems, commissionEarned]);

  // Sync Task changes back to localStorage with support for purchase time timestamp
  const saveWorkbenchState = (
    status: "get_order" | "buy_behalf" | "unshipped" | "shipped" | "arrived",
    isClaimed: boolean,
    claimDate: string,
    purchasedMap: Record<string, boolean>,
    hasCommission: boolean,
    purchasedAtTimestamp: number | null = null
  ) => {
    const stateObj = {
      status,
      claimed: isClaimed,
      claimedAtDate: claimDate,
      purchasedItems: purchasedMap,
      commissionEarned: hasCommission,
      allPurchasedAt: purchasedAtTimestamp
    };
    localStorage.setItem(`workbench_state_${userId}`, JSON.stringify(stateObj));
    
    // update React hooks
    setCurrentOrderState(status);
    setClaimed(isClaimed);
    setClaimedAtDate(claimDate);
    setPurchasedItems(purchasedMap);
    setCommissionEarned(hasCommission);
    setAllPurchasedAt(purchasedAtTimestamp);
  };

  // Get active products for the current active package dynamically
  const currentActiveProducts = activePackage 
    ? (PRODUCTS_BY_PACKAGE[activePackage.id] || PRODUCTS_BY_PACKAGE["ST-1"])
    : PRODUCTS_BY_PACKAGE["ST-1"];

  const totalPurchasePrice = currentActiveProducts.reduce((sum, item) => {
    return sum + item.price;
  }, 0);

  // 1. Claim Order (أمر المطالبة) Click Handler
  const handleClaimOrder = () => {
    if (!currentUser) {
      setAlertMessage("الرجاء تسجيل الدخول أولاً للتمكن من مباشرة طاولة العمل.");
      return;
    }

    // Require active package bought, unless first-time user doing training
    if (!activePackage && currentUser?.hasCompletedTraining) {
      setAlertMessage("عذراً! لا يوجد عقد نشط حالياً لحسابك. يرجى الاشتراك وتفعيل إحدى الباقات في صفحة 'انضم إلينا' أولاً لتوليد المهام اليومية.");
      return;
    }

    // Check if noon has arrived (Automatic or just simulator allowed)
    const todayStr = new Date().toLocaleDateString('en-CA');
    
    // Clean initial purchased status map based on active products
    const initialPurchased: Record<string, boolean> = {};
    currentActiveProducts.forEach((prod) => {
      initialPurchased[prod.id] = false;
    });

    saveWorkbenchState("buy_behalf", true, todayStr, initialPurchased, false);
    setActiveTab("buy_behalf");
  };

  const getScaledCommission = () => {
    if (!activePackage) {
      return currentUser && !currentUser.hasCompletedTraining ? 2.0 : 0;
    }
    return activePackage.daily_income;
  };

  // 2. Click "شراء" (Buy product)
  const openBuyItemModal = (item: any, customerIndex: number) => {
    setSelectedBuyItem(item);
    setSelectedCustomer(CUSTOMERS[customerIndex % CUSTOMERS.length]);
    setShowBuyModal(true);
  };

  const confirmSingleItemPurchase = () => {
    if (!selectedBuyItem) return;

    const updatedPurchased = {
      ...purchasedItems,
      [selectedBuyItem.id]: true
    };

    // Check if ALL items are now purchased
    const allBought = currentActiveProducts.every(p => updatedPurchased[p.id] === true);

    if (allBought) {
      // 1. Credit the commission to the user's simulated account balance!
      const commission = getScaledCommission();
      const usersList = getSimulatedUsers();
      const userIndex = usersList.findIndex(u => u.id === userId);
      
      if (userIndex !== -1) {
        usersList[userIndex].balance += commission;

        // If training, mark it as completed now
        if (!activePackage && !usersList[userIndex].hasCompletedTraining) {
            usersList[userIndex].hasCompletedTraining = true;
            // update currentUser state so React reflects the new training status
            setCurrentUser({...currentUser, hasCompletedTraining: true});
        }

        updateSimulatedUsers(usersList);
        setUserBalanceVal(usersList[userIndex].balance);
      }

      // 2. Progress state directly to initial complete state "unshipped"
      const buyTimestamp = Date.now();
      saveWorkbenchState("unshipped", true, claimedAtDate, updatedPurchased, true, buyTimestamp);
      setShowBuyModal(false);
      setSelectedBuyItem(null);
      
      // Auto-focus the next tab
      setActiveTab("unshipped");
    } else {
      // Standard single item markup
      saveWorkbenchState(currentOrderState, true, claimedAtDate, updatedPurchased, false, allPurchasedAt);
      setShowBuyModal(false);
      setSelectedBuyItem(null);
    }
  };

  return (
    <div className="min-h-full bg-[#f3f6fa] font-sans pb-16" dir={dir}>
      
      {/* Upper Navigation Header Tabs with beautiful spacious layout */}
      <div className="bg-[#3a7af2] text-white flex items-center overflow-x-auto whitespace-nowrap scrollbar-hide shrink-0 shadow-md sticky top-0 z-[100]">
        {tabs.map((tab) => {
          const isCurrentActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3.5 text-[13.5px] font-bold relative transition-colors cursor-pointer shrink-0 ${
                isCurrentActive ? "text-white" : "text-blue-100/80 hover:text-white"
              }`}
            >
              {t(tab.label)}
              {isCurrentActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-white rounded-t-full"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Core Workspace tabs switch container */}
      <div className="px-3 py-2 space-y-3">
          
          {/* TAB 1: الحصول على الطلب */}
          {activeTab === "get_order" && (
            <div className="space-y-3 pt-1 animate-fadeIn">
              
              {/* If already claimed today's task but not yet arrived */}
              {claimed && currentOrderState !== "arrived" ? (
                <div className="flex flex-col items-center justify-center pt-24 pb-12 animate-fadeIn text-center">
                  <Image size={36} strokeWidth={1.5} className="text-gray-300/80 mb-3 animate-pulse" />
                  <p className="text-[#a5b4ca] text-[13px] font-bold leading-none select-none">
                    لقد تلقيت جميع طلبات الشراء لليوم بنجاح!
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-white border border-[#f1f3f7] rounded-xl p-3.5 shadow-sm">
                    {activePackage ? (
                      <p className="text-[12.5px] text-gray-500 leading-relaxed font-semibold">
                         يرجى مراجعة تفاصيل الباقة النشطة: <span className="text-[#2aacc1] font-extrabold text-[13px]">{activePackage.name}</span> برصيد عقد <span className="text-[#f16f2c] font-black">${activePackage.price}</span> وعمولة يومية مضمونة <span className="text-[#10b981] font-black">${activePackage.daily_income}</span>. اضغط بالمطالبة بالأسفل لتلقي الطلبات فوراً.
                      </p>
                    ) : (
                      <p className="text-[12.5px] text-gray-500 leading-relaxed font-semibold">
                        {currentUser?.hasCompletedTraining 
                          ? "عذراً، يرجى الاشتراك في إحدى باقات العضويات المتاحة بصفحة 'انضم إلينا' لتشغيل مهام طاولة العمل والمطالبة بالعمولة اليومية والطلبات!"
                          : "مهام التدريب: قم بإتمام المهام لمرة واحدة لكسب عمولة التدريب 2$. اضغط المطالبة للبدء."}
                      </p>
                    )}
                  </div>

                  {/* 4 products list */}
                  <div className="space-y-2.5">
                    {currentActiveProducts.map((prod) => (
                      <div 
                        key={prod.id} 
                        className="bg-white rounded-xl p-3 border border-[#f1f3f7] flex items-center justify-between shadow-xs hover:border-slate-200 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-[54px] h-[54px] bg-slate-50/50 rounded-lg p-1 shrink-0 flex items-center justify-center overflow-hidden border border-slate-100">
                            <img 
                              referrerPolicy="no-referrer"
                              src={prod.img} 
                              alt={prod.name} 
                              className="max-w-full max-h-full object-contain" 
                            />
                          </div>
                          <div className="text-right">
                            <h4 className="text-[12.5px] font-bold text-slate-700 line-clamp-1 leading-snug">{prod.name}</h4>
                            <span className="text-[10px] font-bold text-rose-500 mt-1 block font-mono bg-rose-50 px-2 py-0.5 rounded w-fit">* 1</span>
                          </div>
                        </div>
                        <div className="text-gray-400 text-[10px] font-mono leading-none font-semibold">
                          {new Date().toLocaleDateString('en-CA')}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* High Quality Claim orders blue button on bottom */}
                  <div className="pt-3 pb-6">
                    <button
                      onClick={handleClaimOrder}
                      className="w-full bg-[#3a7af2] hover:bg-[#2c67ce] active:scale-95 transition-transform text-white font-extrabold py-3 px-4 rounded-xl shadow-md cursor-pointer text-[13.5px] flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={16} />
                      <span>{t("أمر المطالبة")}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: الشراء نيابة عن الآخرين */}
          {activeTab === "buy_behalf" && (
            <div className="space-y-3 animate-fadeIn">
              
              {/* If not claimed today's tasks */}
              {!claimed ? null : (
                <>
                  {/* Top Contract Spec Details Header Bar resembling screenshot exactly */}
                  <div className="bg-white border border-[#f1f3f7] rounded-xl p-3.5 shadow-sm">
                    <div className="grid grid-cols-3 divide-x divide-slate-100 text-center" dir="ltr">
                      {/* Left: Total Purchase amount */}
                      <div className="px-2 py-1 flex flex-col items-center justify-center">
                        <span className="text-[10px] text-gray-400 font-bold tracking-wide mb-1.5 select-none font-sans">
                          إجمالي مبلغ الشراء
                        </span>
                        <span className="text-[14.5px] font-black text-[#3a7af2] font-mono tracking-tight leading-none">
                          {currentOrderState !== "buy_behalf" ? "0" : `$${totalPurchasePrice.toFixed(2)}`}
                        </span>
                      </div>

                      {/* Center: Available Contract Balance */}
                      <div className="px-2 py-1 flex flex-col items-center justify-center border-x border-slate-100">
                        <span className="text-[10px] text-gray-400 font-bold tracking-wide mb-1.5 select-none font-sans">
                          مبلغ العقد المتاح
                        </span>
                        <span className="text-[14.5px] font-black text-slate-800 font-mono tracking-tight leading-none">
                          {currentOrderState !== "buy_behalf" ? "0.00" : `$${activePackage.price.toFixed(2)}`}
                        </span>
                      </div>

                      {/* Right: Commission reward */}
                      <div className="px-2 py-1 flex flex-col items-center justify-center">
                        <span className="text-[10px] text-gray-400 font-bold tracking-wide mb-1.5 select-none font-sans">
                          عمولة
                        </span>
                        <span className="text-[13.5px] font-black text-[#10b981] font-mono tracking-tight leading-none">
                          {currentOrderState !== "buy_behalf" ? "0" : `$${getScaledCommission().toFixed(2)}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {currentOrderState !== "buy_behalf" ? (
                    <div className="flex flex-col items-center justify-center pt-24 pb-12 animate-fadeIn text-center">
                      <Image size={36} strokeWidth={1.5} className="text-gray-300/80 mb-3" />
                      <p className="text-[#a5b4ca] text-[13px] font-bold leading-none select-none">
                        لقد أكملت جميع طلبات الشراء لليوم وبانتظار الشحن!
                      </p>
                    </div>
                  ) : (
                    /* List of 4 buying items */
                    <div className="space-y-2.5">
                      {currentActiveProducts.map((prod, index) => {
                        const itemPrice = prod.price;
                        const isBought = purchasedItems[prod.id] === true;
                        return (
                          <div 
                            key={prod.id} 
                            className="bg-white rounded-xl p-3 border border-[#f1f3f7] flex items-center justify-between shadow-xs transition-colors hover:border-slate-200"
                          >
                            <div className="flex gap-3 items-center flex-1 max-w-[75%]">
                              <div className="w-[54px] h-[54px] bg-slate-50/50 rounded-lg shrink-0 flex items-center justify-center overflow-hidden border border-slate-100">
                                <img 
                                  referrerPolicy="no-referrer"
                                  src={prod.img} 
                                  alt={prod.name} 
                                  className="max-w-full max-h-full object-contain" 
                                />
                              </div>
                              <div className="text-right flex-1 min-w-0 pr-1">
                                <h4 className="text-[12.5px] font-bold text-slate-700 leading-tight block truncate font-sans">{prod.name}</h4>
                                <span className="text-[#fa5c3d] font-black text-[13.5px] font-mono block mt-1 leading-none">
                                  ${itemPrice.toFixed(2)}
                                </span>
                                <span className="text-gray-400 text-[10px] font-mono mt-1 block">
                                   {new Date().toLocaleDateString('en-CA')}
                                </span>
                              </div>
                            </div>

                            <div className="shrink-0 font-sans">
                              {isBought ? (
                                <span className="bg-emerald-50 text-[#10b981] border border-emerald-100 font-extrabold text-[11px] px-3 py-1 rounded-lg shadow-xs">
                                  تم الشراء ✔️
                                </span>
                              ) : (
                                <button
                                  onClick={() => openBuyItemModal(prod, index)}
                                  className="bg-[#fa5c3d] hover:bg-[#e04f32] active:scale-95 transition-all text-white text-[12px] font-extrabold px-3.5 py-1.5 rounded-lg cursor-pointer text-center font-sans shadow-xs"
                                >
                                  {t("شراء")}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* TAB 3: غير مشحونة */}
          {activeTab === "unshipped" && (
            <div className="space-y-3 animate-fadeIn">
              {currentOrderState === "get_order" || currentOrderState === "buy_behalf" ? (
                <div className="text-center p-8 border border-dashed border-slate-200 rounded-xl bg-white shadow-xs">
                  <p className="text-[12px] text-gray-400 font-semibold leading-relaxed">
                     لا توجد سلع مشتراة قيد الانتظار حالياً. قم بإنهاء الشغل في صفحة الحصول على الطلب أولاً!
                  </p>
                </div>
              ) : (
                <>
                  {/* Products list styled with Waiting for shipment badge */}
                  <div className="space-y-2.5">
                    {currentActiveProducts.map((prod) => {
                      const itemPrice = prod.price;
                      return (
                        <div 
                          key={prod.id} 
                          className="bg-white rounded-xl p-3 border border-[#f1f3f7] flex flex-row items-center justify-between gap-3 transition-all"
                          dir="ltr"
                        >
                          <div className="flex items-center gap-3 flex-1 max-w-[75%]">
                            <div className="w-[54px] h-[54px] bg-slate-50/50 rounded-lg shrink-0 flex items-center justify-center overflow-hidden border border-slate-100">
                              <img 
                                referrerPolicy="no-referrer"
                                src={prod.img} 
                                alt=""
                                className="max-w-full max-h-full object-contain" 
                              />
                            </div>

                            <div className="text-left flex-1 min-w-0 pr-1">
                              <h4 className="text-[12.5px] font-bold text-slate-750 leading-snug truncate block">{prod.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[#fa5c3d] font-black text-[13px] font-mono leading-none">
                                  ${itemPrice.toFixed(2)}
                                </span>
                                <span className="text-gray-400 text-[10px] font-mono leading-none">
                                   في دورة اليوم
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0">
                            <span className="bg-amber-50 text-amber-600 border border-amber-100 text-[11px] font-extrabold px-3 py-1 rounded-lg">
                               غير مشحون
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Refunding summary bottom panel resembling picture 4 absolute details */}
                  <div className="bg-white border border-[#f1f3f7] rounded-xl p-3.5 shadow-sm">
                    <div className="flex items-center justify-between text-sm font-bold leading-normal">
                      <div className="text-right flex-1">
                        <span className="text-gray-400 text-[10px] block mb-1 select-none">إجمالي مبلغ الشراء</span>
                        <span className="text-[14.5px] font-black font-mono text-gray-800 tracking-tight leading-none">${totalPurchasePrice.toFixed(2)}</span>
                      </div>
                      <div className="text-left border-r border-[#f1f3f7] pr-5 flex-1">
                        <span className="text-gray-400 text-[10px] block mb-1 select-none font-bold">مبلغ العقد القابل للاسترداد</span>
                        <span className="text-[14.5px] font-black font-mono text-emerald-600 tracking-tight leading-none">${(totalPurchasePrice * 1.05).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 4: تم الشحن */}
          {activeTab === "shipped" && (
            <div className="space-y-3 animate-fadeIn">
              {currentOrderState !== "shipped" && currentOrderState !== "arrived" ? (
                <div className="text-center p-8 border border-dashed border-slate-200 rounded-xl bg-white shadow-xs">
                  <p className="text-[12px] text-gray-400 font-semibold leading-relaxed">
                     لا توجد سلع تم شحنها حالياً في الذاكرة. يجب إكمال الشراء والشحن لتنشيط التبويب.
                  </p>
                </div>
              ) : (
                <>
                  {/* Products list under Shipped status */}
                  <div className="space-y-2.5">
                    {currentActiveProducts.map((prod) => {
                      const itemPrice = prod.price;
                      return (
                        <div 
                          key={prod.id} 
                          className="bg-white rounded-xl p-3 border border-[#f1f3f7] flex flex-row items-center justify-between gap-3 transition-all"
                          dir="ltr"
                        >
                          <div className="flex items-center gap-3 flex-1 max-w-[75%]">
                            <div className="w-[54px] h-[54px] bg-slate-50/50 rounded-lg shrink-0 flex items-center justify-center overflow-hidden border border-slate-100">
                              <img 
                                referrerPolicy="no-referrer"
                                src={prod.img} 
                                alt=""
                                className="max-w-full max-h-full object-contain" 
                              />
                            </div>

                            <div className="text-left flex-1 min-w-0 pr-1">
                              <h4 className="text-[12.5px] font-bold text-slate-700 leading-snug truncate block">{prod.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[#fa5c3d] font-black text-[13px] font-mono leading-none">
                                  ${itemPrice.toFixed(2)}
                                </span>
                                <span className="text-gray-450 text-[10px] font-mono leading-none font-bold">
                                   قيد النقل
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0">
                            <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[11px] font-extrabold px-3 py-1 rounded-lg">
                               تم الشحن ✔️
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 5: لقد وصلت البضائع */}
          {activeTab === "arrived" && (
            <div className="space-y-3 animate-fadeIn">
              
              {currentOrderState !== "arrived" ? (
                <div className="text-center p-8 border border-dashed border-slate-200 rounded-xl bg-white shadow-xs">
                  <p className="text-[12px] text-gray-400 font-semibold leading-relaxed">
                     البضائع قيد النقل ولم تصل لوجهتها النهائية بعد في دورة التشغيل الحالية.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-white border border-[#f1f3f7] rounded-xl p-4 shadow-xs text-center border-t-[4px] border-t-emerald-500">
                    <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-[#10b981] mx-auto mb-2 border border-emerald-100 font-bold">
                      ✓
                    </div>
                    <p className="text-[14px] font-extrabold text-slate-800">مرحى! لقد وصلت جميع البضائع لبيوت العملاء بنجاح 🎉</p>
                    <p className="text-[11.5px] text-gray-500 mt-1 leading-relaxed max-w-sm mx-auto">
                      اكتملت الدورة اليومية للمبيعات بنجاح، وتم تأمين رصيد العقد المتاح وإضافة العمولات المضمونة لمحفظتك بالكامل. جاهز لبدء جولة مبيعات بضائع جديدة غداً!
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {currentActiveProducts.map((prod) => {
                      const itemPrice = prod.price;
                      return (
                        <div 
                          key={prod.id} 
                          className="bg-white rounded-xl p-3 border border-[#f1f3f7] flex flex-row items-center justify-between gap-3 transition-all"
                          dir="ltr"
                        >
                          <div className="flex items-center gap-3 flex-1 max-w-[70%]">
                            <div className="w-[54px] h-[54px] bg-slate-50/50 rounded-lg shrink-0 flex items-center justify-center overflow-hidden border border-slate-100">
                              <img 
                                referrerPolicy="no-referrer"
                                src={prod.img} 
                                alt=""
                                className="max-w-full max-h-full object-contain" 
                              />
                            </div>

                            <div className="text-left flex-1 min-w-0 pr-1">
                              <h4 className="text-[12.5px] font-bold text-slate-700 leading-snug truncate block">{prod.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[#fa5c3d] font-black text-[13px] font-mono leading-none">
                                  ${itemPrice.toFixed(2)}
                                </span>
                                <span className="text-gray-400 text-[10px] font-mono leading-none font-bold">
                                   وصلت البضائع
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0">
                            <span className="bg-emerald-50 text-[#10b981] border border-emerald-100 text-[11px] font-extrabold px-3 py-1 rounded-lg">
                               وصلت
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

        </div>

      {/* CORE MODAL 1: معلومات الطلب للشراء (High Fidelity Purchase Confirmation Modal resembling picture 3) */}
      <AnimatePresence>
        {showBuyModal && selectedBuyItem && selectedCustomer && (
          <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="bg-white rounded-xl w-full max-w-[310px] overflow-hidden border border-slate-50 shadow-xl relative"
            >
              {/* Modal Upper Ribbon Title Header */}
              <div className="bg-[#3a7af2]/5 px-3.5 py-2.5 border-b border-slate-100 text-right flex items-center justify-between">
                <span className="text-[13.5px] font-extrabold text-slate-800 font-sans">
                   معلومات الطلب
                </span>
                <button 
                  onClick={() => setShowBuyModal(false)}
                  className="text-gray-405 hover:text-gray-600 text-base cursor-pointer leading-none pr-1 select-none"
                >
                  ✕
                </button>
              </div>

              {/* Modal Inner Fields */}
              <div className="p-3.5 space-y-3 text-right">
                
                {/* 1. Title Summary with Price */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-start gap-2.5">
                  <div className="w-[44px] h-[44px] bg-white rounded p-0.5 shrink-0 flex items-center justify-center border border-slate-50">
                    <img 
                      referrerPolicy="no-referrer"
                      src={selectedBuyItem.img} 
                      alt="" 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11.5px] font-medium text-slate-700 leading-snug line-clamp-2">
                      {selectedBuyItem.name}
                    </h4>
                    <div className="flex justify-between items-center mt-1 text-[11px]">
                      <span className="text-[#fa5c3d] font-bold font-mono">
                         ${selectedBuyItem.price.toFixed(2)}
                      </span>
                      <span className="text-gray-400 font-bold font-mono">
                         *1
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Addresses and parameters */}
                <div className="space-y-2.5 text-[11.5px] border-t border-slate-100 pt-2.5 pb-0.5">
                  
                  {/* Address input read only display */}
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-400 font-medium flex items-center gap-1 text-[10px]">
                      <MapPin size={11} className="text-gray-400" />
                      عنوان التسليم:
                    </span>
                    <span className="text-slate-750 font-bold leading-normal bg-slate-50 p-2 rounded border border-slate-100 block text-[11px]">
                      {selectedCustomer.address}
                    </span>
                  </div>

                  {/* Customer name read only display */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-400 font-medium flex items-center gap-1 text-[10px]">
                        <User size={11} className="text-gray-400" />
                        اسم المستلم:
                      </span>
                      <span className="text-slate-750 font-semibold bg-slate-50 px-2 py-1 rounded border border-slate-100 block text-[11px] truncate">
                        {selectedCustomer.name}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-gray-400 font-medium flex items-center gap-1 text-[10px]">
                        <Phone size={11} className="text-gray-400" />
                        رقم الهاتف:
                      </span>
                      <span className="text-slate-750 font-bold bg-slate-50 px-2 py-1 rounded border border-slate-100 block text-[10.5px] font-mono leading-none pt-1.5" dir="ltr">
                        {selectedCustomer.phone}
                      </span>
                    </div>
                  </div>

                  {/* Commodity price */}
                  <div className="flex justify-between items-center border-t border-dashed border-slate-100 pt-2.5 mt-1 font-bold">
                    <span className="text-gray-500 text-[10.5px]">إجمالي سعر السلعة:</span>
                    <span className="text-emerald-600 font-extrabold font-mono text-[13px]">
                      ${selectedBuyItem.price.toFixed(2)}
                    </span>
                  </div>

                </div>

                {/* Action button confirming purchase */}
                <div className="pt-1.5">
                  <button
                    onClick={confirmSingleItemPurchase}
                    className="w-full bg-[#3a7af2] hover:bg-[#2d67ce] text-white font-extrabold text-[12px] py-2 rounded-lg shadow-xs active:scale-95 transition-transform cursor-pointer"
                  >
                     تأكيد الشراء والسداد
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: General Alerts/Warning notification popup */}
      <AnimatePresence>
        {alertMessage && (
          <div className="fixed inset-0 bg-black/60 z-[250] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl w-full max-w-[290px] p-4 text-center border border-slate-50 shadow-xl space-y-3"
            >
              <div className="w-9 h-9 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 mx-auto border border-rose-100 shadow-xs">
                <AlertTriangle size={18} />
              </div>
              <h3 className="text-[13px] font-extrabold text-slate-800 leading-snug">
                 تنبيه هام!
              </h3>
              <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
                {alertMessage}
              </p>
              <button
                onClick={() => setAlertMessage(null)}
                className="w-full bg-[#3a7af2] hover:bg-[#2b64ca] text-white font-bold py-2 rounded-lg text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                 موافق
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Grand Success Popups for order completes */}
      <AnimatePresence>
        {grandSuccessMessage && (
          <div className="fixed inset-0 bg-black/60 z-[250] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl w-full max-w-[310px] p-4 text-center border border-slate-50 shadow-xl space-y-3"
            >
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto border border-emerald-100 shadow-xs">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="text-[13.5px] font-extrabold text-slate-800 leading-snug">
                 نجاح العملية!
              </h3>
              <p className="text-[11px] text-emerald-700 leading-relaxed font-bold">
                {grandSuccessMessage}
              </p>
              <button
                onClick={() => setGrandSuccessMessage(null)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                 موافق
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
