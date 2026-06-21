import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Models } from "react-native-appwrite";

import {
  getCurrentUser,
  login,
  loginWithGoogle,
  logout,
  register,
} from "@/services/auth";

interface AuthContextValue {
  user: Models.User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Models.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = useCallback(async (email: string, password: string) => {
    const currentUser = await login(email, password);
    setUser(currentUser);
  }, []);

  const handleRegister = useCallback(
    async (email: string, password: string, name: string) => {
      const currentUser = await register(email, password, name);
      setUser(currentUser);
    },
    [],
  );

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } finally {
      setUser(null);
    }
  }, []);

  const handleGoogleLogin = useCallback(async () => {
    const currentUser = await loginWithGoogle();
    setUser(currentUser);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
      loginWithGoogle: handleGoogleLogin,
    }),
    [
      user,
      loading,
      handleLogin,
      handleRegister,
      handleLogout,
      handleGoogleLogin,
    ],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
