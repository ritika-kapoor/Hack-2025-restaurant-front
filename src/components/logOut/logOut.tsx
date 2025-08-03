"use client";

import { useAuth } from "@/hooks/useAuth";

export default function Logout() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <a onClick={handleLogout} className="cursor-pointer">
      ログアウト
    </a>
  );
}