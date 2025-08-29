"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("store_token");
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };

    // 初回チェック
    checkAuth();

    // storageの変更を監視
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = (token: string, storeId?: string) => {
    localStorage.setItem("store_token", token);
    if (storeId) {
      localStorage.setItem("store_id", storeId);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("store_token");
    localStorage.removeItem("store_id");
    setIsAuthenticated(false);
    router.push("/login");
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
} 