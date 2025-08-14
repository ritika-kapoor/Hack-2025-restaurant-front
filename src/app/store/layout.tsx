"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Header from "@/components/header/header";
import FooterMenu from "@/components/footer/footerMenu";
import { useAuth } from "@/hooks/useAuth";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // 認証が不要なパス
  const publicPaths = ["/store/shopRegister"];
  const isPublicPath = publicPaths.includes(pathname);

  useEffect(() => {
    // 認証チェックが完了し、未認証で、かつ認証が必要なページの場合はログイン画面へリダイレクト
    if (!isLoading && !isAuthenticated && !isPublicPath) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, isPublicPath, router]);

  // 認証チェック中はローディング画面を表示（認証不要ページを除く）
  if (isLoading && !isPublicPath) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">認証状態を確認しています...</p>
        </div>
      </div>
    );
  }

  // 未認証で認証が必要なページの場合は何も表示しない（リダイレクト処理中）
  if (!isAuthenticated && !isPublicPath) {
    return null;
  }

  // 認証済みまたは認証不要ページの場合は通常のレイアウトを表示
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <Header />
      <main className="pb-20 px-4 py-6 max-w-screen-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-orange-200 min-h-[calc(100vh-140px)] p-6">
          {children}
        </div>
      </main>
      {/* フッターメニューは認証済みの場合のみ表示 */}
      {isAuthenticated && <FooterMenu />}
    </div>
  );
}