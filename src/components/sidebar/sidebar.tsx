import { Home, Package, Store, LogOut } from "lucide-react";
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
        className={`bg-gray-200 w-48 h-screen p-4 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative z-50`}
      >
        <nav className="space-y-4">
          <div className="text-lg font-semibold mb-6">Menu</div>

          {/* Home */}
          <Link
            href="/store"
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          >
            <Home className="w-5 h-5" />
            <span>ホーム</span>
          </Link>

          {/* Product Registration */}
          <Link
            href="/store/productRegister"
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          >
            <Package className="w-5 h-5" />
            <span>商品登録</span>
          </Link>

          {/* 店の情報管理*/}
          <Link
            href="/store/editShop"
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          >
            <Store className="w-5 h-5" />
            <span>店舗情報管理</span>
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

          <div className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
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
