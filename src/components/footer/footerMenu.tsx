"use client";

import { Home, Package, Store, LogOut, File } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logout from "../logOut/logOut";
import { useAuth } from "@/hooks/useAuth";

export default function FooterMenu() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  // 認証チェック中または未認証の場合は非表示
  if (isLoading || !isAuthenticated) {
    return null;
  }

  const menuItems = [
    {
      href: "/store",
      icon: Home,
      label: "ホーム",
      id: "home"
    },
    {
      href: "/store/productRegister", 
      icon: Package,
      label: "商品管理",
      id: "products"
    },
    {
      href: "/store/editShop",
      icon: Store,
      label: "店舗管理",
      id: "shop"
    },
    {
      href: "/store/flyer",
      icon: File,
      label: "チラシ",
      id: "flyer"
    }
  ];

  const isActive = (href: string) => {
    if (href === "/store") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <nav className="flex justify-around items-center h-16 px-2 max-w-screen-xl mx-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-xl transition-all duration-200 ${
                isActive(item.href)
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-600 hover:text-orange-500 hover:bg-orange-50"
              }`}
            >
              <Icon 
                className={`w-5 h-5 mb-1 ${
                  isActive(item.href) ? "text-orange-600" : "text-gray-600"
                }`} 
              />
              <span className="text-xs font-medium leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
        
        {/* ログアウトボタン */}
        <div className="flex flex-col items-center justify-center flex-1 py-2 px-1 text-gray-600 hover:text-orange-500">
          <LogOut className="w-5 h-5 mb-1" />
          <div className="text-xs font-medium leading-none">
            <Logout />
          </div>
        </div>
      </nav>
    </footer>
  );
} 