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
  referredBy?: string;
  hasCompletedTraining?: boolean;
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
  txPassword?: string;
}

// Initial Simulated Seed Data
const DEFAULT_USERS: SimulatedUser[] = [
  {
    id: "10001",
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

export const getSimulatedUsers = (): SimulatedUser[] => {
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
    return parsed;
  } catch (e) {
    localStorage.setItem("simulated_users", JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
};

export const updateSimulatedUsers = (users: SimulatedUser[]) => {
  localStorage.setItem("simulated_users", JSON.stringify(users));
};

export const registerSimulatedUser = (email: string, phone: string, referredBy?: string): SimulatedUser => {
  const users = getSimulatedUsers();
  
  // Find next ID
  let nextIdVal = 10002;
  const ids = users.map(u => parseInt(u.id, 10)).filter(id => !isNaN(id));
  if (ids.length > 0) {
    nextIdVal = Math.max(...ids) + 1;
  }
  const nextId = nextIdVal.toString();
  
  const newUser: SimulatedUser = {
    id: nextId,
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
    referredBy
  };
  
  users.push(newUser);
  updateSimulatedUsers(users);
  
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
    id: userId,
    inviteUrl: `https://StackMall.com/${userId}`,
    isExpired: current?.isExpired || false
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
  
  const teamUsers = users.filter(u => u.referredBy === currentUserId);
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
  userId = "10001",
  txPassword = ""
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
    proofImage,
    txPassword
  };
  txs.unshift(newTx);
  updateSimulatedTransactions(txs);
  return newTx;
};
