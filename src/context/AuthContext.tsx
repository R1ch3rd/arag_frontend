import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '../lib/auth';
import { cacheManager } from '../services/cacheManager';

interface User {
  profile: {
    email: string;
  };
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  cacheInitialized: boolean;
  backgroundLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string; needsConfirmation?: boolean }>;
  signup: (email: string, password: string, confirmPassword: string) => Promise<{ success: boolean; error?: string; existingUnconfirmed?: boolean }>;
  confirmSignup: (email: string, confirmationCode: string) => Promise<{ success: boolean; error?: string }>;
  resendConfirmation: (email: string) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string, confirmationCode: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  getIdToken: () => string | null;
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cacheInitialized, setCacheInitialized] = useState(false);
  const [backgroundLoading, setBackgroundLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const isAuth = auth.isAuthenticated();

    setIsAuthenticated(isAuth);
    setIsLoading(false);

    if (isAuth) {
      const userData = auth.getUser();
      const userToken = auth.getIdToken();

      console.log('✅ User authenticated:', userData?.profile.email);
      setUser(userData);
      setToken(userToken);

      if (userToken) {
        initializeCacheInBackground(userToken);
      }
    }
  };

  const initializeCacheInBackground = async (userToken: string) => {
    console.log('🔄 Starting background cache initialization...');
    setBackgroundLoading(true);

    try {
      await cacheManager.initializeCache(userToken);
      setCacheInitialized(true);
      console.log('✅ Background cache initialization complete');
    } catch (error) {
      console.error('❌ Background cache initialization failed:', error);
    } finally {
      setBackgroundLoading(false);
    }
  };

  // ✨ ENHANCED: Login with better error handling
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await auth.login(username, password);
      if (result.success) {
        const userData = auth.getUser();
        const userToken = auth.getIdToken();

        setIsAuthenticated(true);
        setUser(userData);
        setToken(userToken);
        setIsLoading(false);

        if (userToken) {
          initializeCacheInBackground(userToken);
        }

        return { success: true };
      }
      return {
        success: false,
        error: result.error,
        needsConfirmation: result.needsConfirmation
      };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    } finally {
      setIsLoading(false);
    }
  };

  // ✨ ENHANCED: Signup with better error handling
  const signup = async (email: string, password: string, confirmPassword: string) => {
    // Client-side validation
    if (password !== confirmPassword) {
      return { success: false, error: 'Passwords do not match' };
    }

    if (password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long' };
    }

    if (!/[A-Z]/.test(password)) {
      return { success: false, error: 'Password must contain at least one uppercase letter' };
    }

    if (!/[a-z]/.test(password)) {
      return { success: false, error: 'Password must contain at least one lowercase letter' };
    }

    if (!/[0-9]/.test(password)) {
      return { success: false, error: 'Password must contain at least one number' };
    }

    if (!email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address' };
    }

    setIsLoading(true);
    try {
      const result = await auth.signup(email, password);

      if (result.success) {
        return { success: true };
      }

      return {
        success: false,
        error: result.error,
        existingUnconfirmed: result.existingUnconfirmed
      };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    } finally {
      setIsLoading(false);
    }
  };

  const confirmSignup = async (email: string, confirmationCode: string) => {
    setIsLoading(true);
    try {
      const result = await auth.confirmSignup(email, confirmationCode);

      if (result.success) {
        return { success: true };
      }

      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    } finally {
      setIsLoading(false);
    }
  };

  const resendConfirmation = async (email: string) => {
    setIsLoading(true);
    try {
      const result = await auth.resendConfirmation(email);

      return { success: result.success, error: result.error };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const result = await auth.forgotPassword(email);

      return { success: result.success, error: result.error };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string, confirmationCode: string, newPassword: string) => {
    setIsLoading(true);
    try {
      const result = await auth.resetPassword(email, confirmationCode, newPassword);

      return { success: result.success, error: result.error };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    auth.logout();
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    setCacheInitialized(false);
    setBackgroundLoading(false);

    cacheManager.clearAll();
    console.log('🧹 Cache cleared on logout');
  };

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    token,
    cacheInitialized,
    backgroundLoading,
    login,
    signup,
    confirmSignup,
    resendConfirmation,
    forgotPassword,
    resetPassword,
    signOut,
    getIdToken: () => auth.getIdToken(),
    getAccessToken: () => auth.getAccessToken()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};