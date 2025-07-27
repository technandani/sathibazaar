"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IUser } from "@/types";

interface AuthContextType {
  user: { id: string; role: string; email: string; fullName: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyOtp: (userId: string, otp: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  verifyOtp: async () => {},
  isLoading: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      const userData = await response.json();
      setUser(userData.user);
      router.push(`/${userData.user.role}/dashboard`);
    } else {
      throw new Error((await response.json()).message);
    }
  };

  const verifyOtp = async (userId: string, otp: string) => {
    const response = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userId, otp }),
    });
    if (response.ok) {
      const userData = await response.json();
      setUser(userData.user);
      router.push(`/${userData.user.role}/dashboard`);
    } else {
      throw new Error((await response.json()).message);
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    router.push("/vendor/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, verifyOtp, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);