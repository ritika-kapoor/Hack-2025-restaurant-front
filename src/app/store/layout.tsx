"use client";

import Header from "@/components/header/header";
import Sidebar from "@/components/sidebar/sidebar";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
  
    return (
      <div className="min-h-screen">
        <Header onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        <div className="flex">
          <div className="sticky top-0 h-screen">
            <Sidebar isOpen={isSidebarOpen} />
          </div>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    );
  }