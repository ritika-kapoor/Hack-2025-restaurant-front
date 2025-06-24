type HeaderProps = {
    onToggleSidebar: () => void;
  };
  
  export default function Header({ onToggleSidebar }: HeaderProps) {
    return (
      <header className="p-4 bg-gray-800 text-white flex items-center">
        <button onClick={onToggleSidebar} className="md:hidden">
          ☰ {/* ハンバーガーアイコン（必要に応じてSVGでもOK） */}
        </button>
        <h1 className="ml-4">店側管理</h1>
      </header>
    );
  }