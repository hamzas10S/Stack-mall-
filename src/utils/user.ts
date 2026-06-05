import { supabase } from './supabase';

export interface SimulatedUser {
  id: string;
  email: string;
  regDate: string;
  isActive: boolean; // has active package bought
  packageBought: string;
  withdrawalsCount: number;
  rechargesCount: number;
  balance: number;
  contractBalance: number;
  lastActivity: string;
  isExpired: boolean;
  phone?: string;
  walletAddress?: string;
  transactionPassword?: string;
  referredBy?: string; // This can now hold the 10000x userCode or UUID
  hasCompletedTraining?: boolean;
  userCode?: string; // Short invite code/account ID
}

export interface SimulatedTransaction {
  id: string;
  userId: string;
  type: "deposit" | "withdraw";
  amount: number;
  status: "pending" | "approved" | "rejected";
  date: string;
  address?: string;
  network?: string;
  proofImage?: string; // base64 or placeholder URL image
}

// Initial Simulated Seed Data
const DEFAULT_USERS: SimulatedUser[] = [
  {
    id: "10001",
    userCode: "100001",
    email: "hamozasalom@gmail.com",
    regDate: "2026-05-18",
    isActive: false,
    packageBought: "",
    withdrawalsCount: 0,
    rechargesCount: 0,
    balance: 0.00,
    contractBalance: 0.00,
    lastActivity: "نشط الآن",
    isExpired: false
  }
];

let supabaseUsersCache: SimulatedUser[] | null = null;
let supabaseTxsCache: SimulatedTransaction[] | null = null;

export const initSupabaseSync = async () => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const currentUserId = sessionData?.session?.user?.id;
    
    // Only fetch current user data to avoid data leak (unless admin, which uses separate queries now)
    let query = supabase.from('app_users').select('*');
    if (currentUserId) {
        query = query.eq('id', currentUserId);
    } else {
        query = query.limit(1); // Do not dump whole db to unauthenticated users
    }

    const { data: usersData } = await query;
    let allUsersData = [...(usersData || [])];
    
    // Also fetch the team members to properly calculate team stats
    if (currentUserId && usersData && usersData.length > 0) {
        const currentUser = usersData[0];
        const userCode = currentUser.user_code || currentUser.id;
        
        try {
            const { data: teamData } = await supabase.from('app_users')
               .select('*')
               .or(`referred_by.eq.${userCode},referred_by.eq.${currentUserId}`);
               
            if (teamData && teamData.length > 0) {
               // Append unique users
               const existingIds = new Set(allUsersData.map(u => u.id));
               teamData.forEach(t => {
                   if (!existingIds.has(t.id)) {
                       allUsersData.push(t);
                       existingIds.add(t.id);
                   }
               });
            }
        } catch (teamErr) {
            console.error("Could not fetch team data", teamErr);
        }
    }

    const localUsersData: Record<string, SimulatedUser> = {};
    let localUsersArray = [];
    try {
      localUsersArray = JSON.parse(localStorage.getItem("simulated_users") || "[]");
    } catch(e) {
      console.warn("Could not parse local users data", e);
    }
    if (Array.isArray(localUsersArray)) {
       localUsersArray.forEach(u => {
          if (u.id) localUsersData[u.id] = u;
       });
    }

    if (allUsersData && allUsersData.length > 0) {
      supabaseUsersCache = allUsersData.map(u => {
        const matchingLocal = localUsersData[u.id];
        return {
          id: u.id.toString(),
          userCode: matchingLocal?.userCode || undefined, // Fallback to local
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
        };
      });
      // run backfill logic for any that still missed
      let currentMaxCode = 100000;
      supabaseUsersCache.forEach(u => {
        if (u.userCode) {
           currentMaxCode = Math.max(currentMaxCode, parseInt(u.userCode));
        }
      });
      supabaseUsersCache.forEach(u => {
        if (!u.userCode) {
          currentMaxCode++;
          u.userCode = currentMaxCode.toString();
        }
      });
    }

    // Only fetch current user's transactions
    let txQuery = supabase.from('app_transactions').select('*');
    if (currentUserId) {
        txQuery = txQuery.eq('user_id', currentUserId);
    } else {
        txQuery = txQuery.limit(1);
    }
    
    const { data: txsData } = await txQuery;
    if (txsData && txsData.length > 0) {
      supabaseTxsCache = txsData.map(t => ({
        id: t.id.toString(),
        userId: t.user_id?.toString() || "10001",
        type: t.type as "deposit" | "withdraw",
        amount: Number(t.amount) || 0,
        status: t.status as any,
        date: t.timestamp || new Date().toISOString(),
        network: t.network,
        address: t.wallet
      }));
    }
  } catch (err) {
    console.error("Supabase sync failed", err);
  }
};

const mapSimulatedToDb = (u: SimulatedUser) => ({
    email: u.email,
    reg_date: u.regDate,
    is_active: u.isActive,
    package_bought: u.packageBought,
    withdrawals_count: u.withdrawalsCount,
    recharges_count: u.rechargesCount,
    balance: u.balance,
    contract_balance: u.contractBalance,
    last_activity: u.lastActivity,
    is_expired: u.isExpired,
    phone: u.phone,
    referred_by: u.referredBy,
    has_completed_training: u.hasCompletedTraining
});

export const getSimulatedUsers = (): SimulatedUser[] => {
  if (supabaseUsersCache) return supabaseUsersCache;
  const data = localStorage.getItem("simulated_users");
  if (!data) {
    localStorage.setItem("simulated_users", JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
  try {
    const parsed = JSON.parse(data) as SimulatedUser[];
    const hasMock = parsed.some(u => u.id === "20485" || u.email === "fatima.sh@gmail.com");
    if (hasMock) {
      localStorage.setItem("simulated_users", JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    
    // Backfill userCodes
    let modified = false;
    let currentMaxCode = 100000;
    parsed.forEach(u => {
      if (u.userCode) {
         currentMaxCode = Math.max(currentMaxCode, parseInt(u.userCode));
      }
    });
    
    parsed.forEach(u => {
      if (!u.userCode) {
        currentMaxCode++;
        u.userCode = currentMaxCode.toString();
        modified = true;
      }
    });

    if (modified) {
       localStorage.setItem("simulated_users", JSON.stringify(parsed));
    }
    
    return parsed;
  } catch (e) {
    localStorage.setItem("simulated_users", JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
};

export const updateSimulatedUsers = async (users: SimulatedUser[]) => {
  supabaseUsersCache = users;
  localStorage.setItem("simulated_users", JSON.stringify(users));
  // Background Sync
  try {
    for (const u of users) {
      if (u.id === "10001" || !u.id.includes("-")) continue; // DO NOT sync mock users to supabase
      await supabase.from('app_users').update({
         balance: u.balance,
         contract_balance: u.contractBalance,
         package_bought: u.packageBought,
         is_active: u.isActive
      }).eq('id', u.id);
    }
  } catch(e) {}
};

export const registerSimulatedUser = async (email: string, phone: string, referredBy?: string, uid?: string, explicitUserCode?: string): Promise<SimulatedUser> => {
  const users = getSimulatedUsers();
  
  let nextId = uid || crypto.randomUUID();
  
  let nextUserCode = explicitUserCode;
  
  if (!nextUserCode) {
     nextUserCode = Math.floor(100000 + Math.random() * 900000).toString();
     while (users.some(u => u.userCode === nextUserCode)) {
         nextUserCode = Math.floor(100000 + Math.random() * 900000).toString();
     }
  }
  
  const newUser: SimulatedUser = {
    id: nextId,
    userCode: nextUserCode,
    email: email.trim() || `${phone || 'user'}@gmail.com`,
    regDate: new Date().toISOString().split("T")[0],
    isActive: false,
    packageBought: "",
    withdrawalsCount: 0,
    rechargesCount: 0,
    balance: 0.00,
    contractBalance: 0.00,
    lastActivity: "نشط الآن",
    isExpired: false,
    phone,
    referredBy
  };
  
  users.push(newUser);
  supabaseUsersCache = users;
  localStorage.setItem("simulated_users", JSON.stringify(users));
  localStorage.setItem("userId", nextId);

  return newUser;
};

// Logged in user helpers
export const getUserInfo = () => {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = "10001";
    localStorage.setItem("userId", userId);
  }
  
  // Ensure user exists in our DB array as well
  const users = getSimulatedUsers();
  const current = users.find(u => u.id === userId);
  if (!current) {
    const newUser: SimulatedUser = {
      id: userId,
      email: "hamozasalom@gmail.com",
      regDate: new Date().toISOString().split("T")[0],
      isActive: false,
      packageBought: "",
      withdrawalsCount: 0,
      rechargesCount: 0,
      balance: 0.00,
      contractBalance: 0.00,
      lastActivity: "نشط الآن",
      isExpired: false
    };
    users.push(newUser);
    updateSimulatedUsers(users);
  }

  return {
    id: current?.userCode || userId, // Display short code!
    realId: userId,
    inviteUrl: `${window.location.origin}/register?ref=${current?.userCode || userId}`,
    isExpired: current?.isExpired || false,
    userCode: current?.userCode || userId
  };
};

export const getUserBalance = (): number => {
  const userId = localStorage.getItem("userId") || "10001";
  const users = getSimulatedUsers();
  const user = users.find(u => u.id === userId);
  return user ? user.balance : 0.00;
};

export const getUserContractBalance = (): number => {
  const userId = localStorage.getItem("userId") || "10001";
  const users = getSimulatedUsers();
  const user = users.find(u => u.id === userId);
  return user ? user.contractBalance : 0.00;
};

export const setUserBalance = (val: number) => {
  const userId = localStorage.getItem("userId") || "10001";
  const users = getSimulatedUsers();
  const updated = users.map(u => {
    if (u.id === userId) {
      return { ...u, balance: val };
    }
    return u;
  });
  updateSimulatedUsers(updated);
};

export const setUserContractBalance = (val: number) => {
  const userId = localStorage.getItem("userId") || "10001";
  const users = getSimulatedUsers();
  const updated = users.map(u => {
    if (u.id === userId) {
      return { ...u, contractBalance: val };
    }
    return u;
  });
  updateSimulatedUsers(updated);
};

// General user modifying helper (for manual administration)
export const modifyUserBalance = (userId: string, newBalance: number) => {
  const users = getSimulatedUsers();
  const updated = users.map(u => {
    if (u.id === userId) {
      return { ...u, balance: newBalance };
    }
    return u;
  });
  updateSimulatedUsers(updated);
};

export const modifyUserContractBalance = (userId: string, newContractBal: number) => {
  const users = getSimulatedUsers();
  const updated = users.map(u => {
    if (u.id === userId) {
      return { ...u, contractBalance: newContractBal };
    }
    return u;
  });
  updateSimulatedUsers(updated);
};

export const modifyUserExpiredStatus = (userId: string, isExpired: boolean) => {
  const users = getSimulatedUsers();
  const updated = users.map(u => {
    if (u.id === userId) {
      return { ...u, isExpired };
    }
    return u;
  });
  updateSimulatedUsers(updated);
};

export const buyPackage = (userId: string, packageId: string, price: number): { success: boolean; message: string } => {
  const users = getSimulatedUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return { success: false, message: "المستخدم غير موجود" };
  }

  const user = users[userIndex];
  if (user.balance < price) {
    return { success: false, message: "رصيد المحفظة غير كافٍ للاشتراك بهذه الباقة المحددة!" };
  }

  user.balance -= price;
  user.contractBalance += price; // Increase the contract balance active block
  user.packageBought = packageId;
  user.isActive = true;

  users[userIndex] = user;
  updateSimulatedUsers(users);
  
  return { success: true, message: `تهانينا! لقد نجحت بشراء الباقة ${packageId} وتم خصم $${price} من رصيدك` };
};

// Team Performance
export const getTeamStats = () => {
  const currentUserId = localStorage.getItem("userId") || "10001";
  const users = getSimulatedUsers();
  
  const currentUser = users.find(u => u.id === currentUserId);
  const userCode = currentUser?.userCode || currentUserId;
  
  const teamUsers = users.filter(u => u.referredBy === currentUserId || u.referredBy === userCode);
  const teamSize = teamUsers.length;
  const validUsers = teamUsers.filter(u => u.isActive).length;
  const unrechargedUsers = teamUsers.filter(u => !u.isActive).length;

  return { teamSize, validUsers, unrechargedUsers };
};

export const setTeamStats = (teamSize: number, validUsers: number, unrechargedUsers: number) => {
  // Now computed dynamically, so this is a no-op
};

export const addSimulatedReferral = () => {
  // No-op, referral is now handled at registration via referredBy
};

// Simulated Transactions (deposits, proof images, withdrawals)
export const getSimulatedTransactions = (): SimulatedTransaction[] => {
  const data = localStorage.getItem("simulated_txs");
  if (!data) {
    const initial: SimulatedTransaction[] = [];
    localStorage.setItem("simulated_txs", JSON.stringify(initial));
    return initial;
  }
  try {
    const parsed = JSON.parse(data) as SimulatedTransaction[];
    const hasMock = parsed.some(t => t.id === "TX-101" || t.id === "TX-102");
    if (hasMock) {
      const initial: SimulatedTransaction[] = [];
      localStorage.setItem("simulated_txs", JSON.stringify(initial));
      return initial;
    }
    return parsed;
  } catch (e) {
    const initial: SimulatedTransaction[] = [];
    localStorage.setItem("simulated_txs", JSON.stringify(initial));
    return initial;
  }
};

export const updateSimulatedTransactions = (txs: SimulatedTransaction[]) => {
  localStorage.setItem("simulated_txs", JSON.stringify(txs));
};

export const addSimulatedTransaction = (
  type: "deposit" | "withdraw",
  amount: number,
  network = "BEP20",
  address = "",
  proofImage = "",
  userId = "10001"
) => {
  const txs = getSimulatedTransactions();
  const currentUserId = localStorage.getItem("userId") || "10001";
  
  // If the parameter is left as the default "10001", check if a different user is logged in
  const activeUserId = userId === "10001" ? currentUserId : userId;

  const newTx: SimulatedTransaction = {
    id: `TX-${Math.floor(100 + Math.random() * 900)}`,
    userId: activeUserId,
    type,
    amount,
    status: "pending",
    date: new Date().toISOString().replace("T", " ").slice(0, 16),
    network,
    address,
    proofImage
  };
  txs.unshift(newTx);
  updateSimulatedTransactions(txs);
  return newTx;
};
