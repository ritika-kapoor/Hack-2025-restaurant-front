import { Home, Package, Store, LogOut, File } from "lucide-react";
import Link from "next/link";
import Logout from "../logOut/logOut";

type SidebarProps = {
  isOpen: boolean;
};

export default function Sidebar({ isOpen }: SidebarProps) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-orange-100 w-48 h-screen p-4 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative z-50 shadow-sm`}
      >
        <nav className="space-y-2">
          <div className="text-lg font-semibold mb-6 text-[#563124] border-b border-orange-100 pb-3">Menu</div>

          {/* Home */}
          <Link
            href="/store"
            className="flex items-center space-x-3 p-3 rounded-xl text-[#563124] hover:bg-[#F7F4F4] hover:text-[#563124] transition-all duration-200"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">ホーム</span>
          </Link>

          {/* Product Registration */}
          <Link
            href="/store/productRegister"
            className="flex items-center space-x-3 p-3 rounded-xl text-[#563124] hover:bg-[#F7F4F4] hover:text-[#563124] transition-all duration-200"
          >
            <Package className="w-5 h-5" />
            <span className="font-medium">商品登録</span>
          </Link>

          {/* 店の情報管理*/}
          <Link
            href="/store/editShop"
            className="flex items-center space-x-3 p-3 rounded-xl text-[#563124] hover:bg-[#F7F4F4] hover:text-[#563124] transition-all duration-200"
          >
            <Store className="w-5 h-5" />
            <span className="font-medium">店舗情報管理</span>
          </Link>

          <Link href="/store/flyer" className="flex items-center space-x-3 p-3 rounded-xl text-[#563124] hover:bg-[#F7F4F4] hover:text-[#563124] transition-all duration-200">
            <File className="w-5 h-5"/>
            <span className="font-medium">チラシ設定</span>
          </Link>

          {/* 時期に追加するかも */}
          {/* Notifications */}
          {/* <Link
            href="/store/notifications"
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          >
            <Bell className="w-5 h-5" />
            <span>通知</span>
          </Link> */}

          <div className="flex items-center space-x-3 p-3 rounded-xl text-[#563124] hover:bg-[#F7F4F4] hover:text-[#563124] transition-all duration-200">
            <LogOut className="w-5 h-5" />
            <Logout />
          </div>

          {/* 時期に追加するかも */}
          {/* Order Management
                    <Link href="/store/orders" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                        <ShoppingCart className="w-5 h-5" />
                        <span>注文管理</span>
                    </Link> */}

          {/* 時期に追加するかも */}
          {/* QR Code Scanner
                    <Link href="/qr-scanner" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                        <QrCode className="w-5 h-5" />
                        <span>QRコード読み取り</span>
                    </Link> */}
        </nav>
      </aside>
    </div>
  );
}
