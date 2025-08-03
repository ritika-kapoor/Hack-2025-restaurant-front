"use client";

import { Store } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-gradient-to-r from-orange-500 to-orange-600 shadow-sm">
      <div className="flex items-center justify-center px-4 py-3 mx-auto max-w-screen-xl">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-sm">
            <Store className="w-5 h-5 text-orange-600" />
          </div>
          <h1 className="text-xl font-bold text-white">meguru店舗管理</h1>
        </div>
      </div>
    </header>
  );
}