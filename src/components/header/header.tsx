"use client";

import { Store } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#563124] shadow-sm">
      <div className="flex items-center justify-center px-4 py-4 mx-auto max-w-screen-xl">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm">
            <Store className="w-6 h-6 text-[#F1B300]" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">meguru店舗管理</h1>
        </div>
      </div>
    </header>
  );
}