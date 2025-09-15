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
      const isAuth = !!token;
      console.log('useAuth checkAuth:', { token: token ? 'exists' : 'none', isAuth });
      setIsAuthenticated(isAuth);
      setIsLoading(false);
    };

    // 初回チェック
    console.log('useAuth initial check');
    checkAuth();

    // storageの変更を監視
    const handleStorageChange = () => {
      console.log('useAuth storage change detected');
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = (token: string, storeId?: string) => {
    console.log('useAuth login called:', { token: token ? 'exists' : 'none', storeId });
    localStorage.setItem("store_token", token);
    if (storeId) {
      localStorage.setItem("store_id", storeId);
    }
    // 即座に認証状態を更新
    console.log('useAuth setting isAuthenticated to true');
    setIsAuthenticated(true);
    setIsLoading(false);
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