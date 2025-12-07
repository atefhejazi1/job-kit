"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { User } from "@/types/auth.types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User, accessToken?: string, refreshToken?: string) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  refreshAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Refresh authentication - check if token is valid
  const refreshAuth = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include", // Include cookies
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        return true;
      } else {
        // Try to refresh the token
        const refreshRes = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (refreshRes.ok) {
          // Token refreshed, try to get user again
          const retryRes = await fetch("/api/auth/me", {
            credentials: "include",
          });

          if (retryRes.ok) {
            const data = await retryRes.json();
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
            return true;
          }
        }

        // Refresh failed, clear auth
        setUser(null);
        localStorage.removeItem("user");
        return false;
      }
    } catch (error) {
      console.error("Error refreshing auth:", error);
      return false;
    }
  }, []);

  // Load user on mount - try JWT first, fallback to localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        // First, try to validate with the server
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          // Fallback to localStorage for backward compatibility
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Fallback to localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
          } catch {
            localStorage.removeItem("user");
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (
    userData: User,
    accessToken?: string,
    refreshToken?: string
  ) => {
    console.log("Logging in user:", userData);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    // Store tokens in memory if needed (cookies are set by server)
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
  };

  const logout = async () => {
    try {
      // Call logout API to clear cookies
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }

    // Clear local state
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Redirect to login
    window.location.href = "/login";
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Helper hook for role-based access
export function useUserType() {
  const { user } = useAuth();
  return {
    userType: user?.userType || null,
    isCompany: user?.userType === "COMPANY",
    isUser: user?.userType === "USER",
  };
}
