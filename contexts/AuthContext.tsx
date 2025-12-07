"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@/types/auth.types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser?: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
      localStorage.removeItem("user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: User) => {
    console.log("Logging in user:", userData);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  // updateUser: update local state + localStorage and optionally notify server
  const updateUser = async (data: Partial<User>) => {
    const next = { ...user, ...data } as User;
    setUser(next);
    try {
      localStorage.setItem("user", JSON.stringify(next));
    } catch (err) {
      console.error("Failed to save user to localStorage", err);
    }

    // Try to persist to server if endpoint exists; don't block on failure
    try {
      await fetch("/api/auth/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (err) {
      // swallow network errors
      console.debug("No server update for user settings or request failed", err);
    }
  };

  // include updateUser in provided context
  (value as any).updateUser = updateUser;

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
