import axiosInstance from "@/src/config/axiosInstance";
import { getProfile } from "@/src/services/authService";
import {
    clearAllAuth,
    getAuthToken,
    saveAuthToken,
    saveUserData,
    setAuthToken,
} from "@/src/store/authStorage";
import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  name?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  setAuth: (token: string, user: User) => Promise<void>;
  clearAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>(null as any);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from storage on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = await getAuthToken();

        if (!storedToken) {
          return;
        }

        const profile = await getProfile();

        setToken(storedToken);
        setAuthToken(storedToken);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${storedToken}`;

        const nextUser = {
          id: profile.id,
          email: profile.email,
          name: profile.name,
        };

        setUser(nextUser);
        await saveUserData(nextUser);
      } catch (error) {
        console.log("🔐 Stored session is invalid. Clearing auth.");
        setToken(null);
        setUser(null);
        setAuthToken(null);
        delete axiosInstance.defaults.headers.common.Authorization;
        await clearAllAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const setAuth = async (newToken: string, newUser: User) => {
    try {
      setToken(newToken);
      setUser(newUser);
      setAuthToken(newToken);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`;
      await saveAuthToken(newToken);
      await saveUserData(newUser);
    } catch (error) {
      console.error("Error setting auth:", error);
    }
  };

  const clearAuthState = async () => {
    try {
      setToken(null);
      setUser(null);
      setAuthToken(null);
      delete axiosInstance.defaults.headers.common.Authorization;
      await clearAllAuth();
    } catch (error) {
      console.error("Error clearing auth:", error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isLoggedIn: !!token,
    setAuth,
    clearAuth: clearAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
