
import { User, GeneratedImage, AdminStats, UserCredentials, CreditPlan } from "../types";
import { auth } from "./firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

const USERS_KEY = 'lumina_users';
const HISTORY_KEY = 'lumina_history';
const PLANS_KEY = 'lumina_credit_plans';

export const mockBackend = {
  // --- AUTH METHODS ---
  
  signup: async (creds: UserCredentials): Promise<User> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, creds.email, creds.password!);
      const fbUser = userCredential.user;
      
      // Send verification email
      await sendEmailVerification(fbUser);

      // Attempt to set display name if provided
      if (creds.name) {
        await updateProfile(fbUser, { displayName: creds.name });
      }

      const newUser: User = {
        id: fbUser.uid,
        email: fbUser.email || '',
        name: fbUser.displayName || creds.name || fbUser.email?.split('@')[0] || 'Explorer',
        credits: 5, // Sign up bonus
        isAdmin: false
      };

      // Persist user metadata in local storage
      const usersJson = localStorage.getItem(USERS_KEY);
      const users = usersJson ? JSON.parse(usersJson) : {};
      users[fbUser.email!] = newUser;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));

      // Sign out immediately to respect the "do not sign in automatically" requirement
      await signOut(auth);
      
      return newUser;
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error("USER_EXISTS");
      }
      throw error;
    }
  },

  login: async (creds: UserCredentials): Promise<User> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, creds.email, creds.password!);
      const fbUser = userCredential.user;
      
      const usersJson = localStorage.getItem(USERS_KEY);
      const users = usersJson ? JSON.parse(usersJson) : {};
      
      let user = users[fbUser.email!];
      
      if (!user) {
        user = {
          id: fbUser.uid,
          email: fbUser.email || '',
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Explorer',
          credits: 5,
          isAdmin: fbUser.email === 'admin@lumina.ai'
        };
        // Persist the missing user metadata
        users[fbUser.email!] = user;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }

      return user;
    } catch (error: any) {
      throw new Error("AUTH_FAILED");
    }
  },

  loginWithGoogle: async (): Promise<User> => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;

      const usersJson = localStorage.getItem(USERS_KEY);
      const users = usersJson ? JSON.parse(usersJson) : {};
      
      let user = users[fbUser.email!];
      
      if (!user) {
        // New user from Google
        user = {
          id: fbUser.uid,
          email: fbUser.email || '',
          name: fbUser.displayName || 'Explorer',
          credits: 5,
          isAdmin: fbUser.email === 'admin@lumina.ai'
        };
        users[fbUser.email!] = user;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }

      return user;
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      if (error.code === 'auth/unauthorized-domain') {
        throw new Error("UNAUTHORIZED_DOMAIN");
      }
      throw new Error("GOOGLE_AUTH_FAILED");
    }
  },

  resetPassword: async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(error.message || "Failed to send reset email");
    }
  },

  logout: async () => {
    await signOut(auth);
  },

  // --- USER METHODS ---

  getCurrentUser: (): User | null => {
    const fbUser = auth.currentUser;
    // For Google users, emailVerified is true. For email users, we check strictly.
    if (!fbUser || !fbUser.emailVerified) return null;

    const usersJson = localStorage.getItem(USERS_KEY);
    const users = usersJson ? JSON.parse(usersJson) : {};
    return users[fbUser.email!] || null;
  },

  getAllUsers: (): User[] => {
    const usersJson = localStorage.getItem(USERS_KEY);
    const users = usersJson ? JSON.parse(usersJson) : {};
    return Object.values(users);
  },

  updateAnyUserCredits: (userId: string, credits: number): User => {
    const usersJson = localStorage.getItem(USERS_KEY);
    const users = usersJson ? JSON.parse(usersJson) : {};
    
    const email = Object.keys(users).find(k => users[k].id === userId);
    if (email) {
      users[email].credits = credits;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      return users[email];
    }
    throw new Error("User not found");
  },

  updateCredits: (amount: number): User => {
    const user = mockBackend.getCurrentUser();
    if (!user) throw new Error("Not authenticated");
    return mockBackend.updateAnyUserCredits(user.id, user.credits + amount);
  },

  deductCredit: (): boolean => {
    const user = mockBackend.getCurrentUser();
    if (!user || user.credits <= 0) return false;
    mockBackend.updateAnyUserCredits(user.id, user.credits - 1);
    return true;
  },

  // --- CREDIT PLAN METHODS ---

  getPlans: (): CreditPlan[] => {
    const plansJson = localStorage.getItem(PLANS_KEY);
    return plansJson ? JSON.parse(plansJson) : [];
  },

  updatePlan: (updatedPlan: CreditPlan): CreditPlan[] => {
    const plans = mockBackend.getPlans();
    const index = plans.findIndex(p => p.id === updatedPlan.id);
    if (index !== -1) {
      plans[index] = updatedPlan;
      localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
    }
    return plans;
  },

  // --- DATA METHODS ---

  saveImage: (prompt: string, imageUrl: string, aspectRatio: string): GeneratedImage => {
    const user = mockBackend.getCurrentUser();
    if (!user) throw new Error("Not authenticated");

    const historyJson = localStorage.getItem(HISTORY_KEY);
    const history = historyJson ? JSON.parse(historyJson) : [];
    
    const newImage: GeneratedImage = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      prompt,
      imageUrl,
      aspectRatio,
      timestamp: Date.now()
    };

    history.unshift(newImage);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 100)));
    return newImage;
  },

  getHistory: (userId: string): GeneratedImage[] => {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    const history = historyJson ? JSON.parse(historyJson) : [];
    return history.filter((img: GeneratedImage) => img.userId === userId);
  },

  getAdminStats: (): AdminStats => {
    const users = mockBackend.getAllUsers();
    const historyJson = localStorage.getItem(HISTORY_KEY);
    const history = historyJson ? JSON.parse(historyJson) : [];
    
    return {
      totalUsers: users.length,
      totalCredits: users.reduce((acc, u) => acc + (u.credits || 0), 0),
      totalImages: history.length,
      activeToday: Math.max(1, Math.floor(users.length * 0.4))
    };
  }
};

// Initial seeding for plans
(function seed() {
  const plansJson = localStorage.getItem(PLANS_KEY);
  if (!plansJson) {
    const defaultPlans: CreditPlan[] = [
      { id: 'starter', name: 'Starter', credits: 20, price: 9.99 },
      { id: 'pro', name: 'Pro Studio', credits: 100, price: 29.99, popular: true },
      { id: 'unlimited', name: 'Unlimited', credits: 500, price: 99.99 }
    ];
    localStorage.setItem(PLANS_KEY, JSON.stringify(defaultPlans));
  }
})();
