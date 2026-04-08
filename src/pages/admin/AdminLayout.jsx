import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, FolderOpen, Users, MessageSquare, Phone, LogOut, Menu } from "lucide-react";

const BASE = import.meta.env.VITE_ADMIN_PATH || "/ema-admin";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: `${BASE}/dashboard` },
  { label: "Projects", icon: FolderOpen, path: `${BASE}/projects` },
  { label: "Team", icon: Users, path: `${BASE}/team` },
  { label: "Messages", icon: MessageSquare, path: `${BASE}/messages` },
  { label: "Contact Info", icon: Phone, path: `${BASE}/contact-info` },
];

const AdminLayout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate(BASE, { replace: true });
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800">
      <div className="px-6 py-8 border-b border-zinc-800">
        <Link to="/" target="_blank" className="block">
          <p className="text-white text-xs uppercase tracking-[0.3em] font-light">EMA</p>
          <p className="text-zinc-600 text-[9px] uppercase tracking-widest mt-0.5">Architecture</p>
        </Link>
        <p className="text-zinc-700 text-[8px] uppercase tracking-widest mt-3">Admin Panel</p>
      </div>
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map(({ label, icon: Icon, path }) => {
          const active = location.pathname === path;
          return (
            <Link key={path} to={path} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded text-[10px] uppercase tracking-wider transition-all duration-200 ${active ? "bg-white text-black" : "text-zinc-400 hover:text-white hover:bg-zinc-800"}`}>
              <Icon size={14} />{label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-6 border-t border-zinc-800">
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 w-full text-[10px] uppercase tracking-wider text-zinc-500 hover:text-red-400 transition-colors">
          <LogOut size={14} />Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-900 flex">
      <div className="hidden md:flex w-56 flex-shrink-0">
        <div className="fixed h-full w-56"><Sidebar /></div>
      </div>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-56"><Sidebar /></div>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden flex items-center justify-between px-4 py-4 bg-zinc-950 border-b border-zinc-800">
          <button onClick={() => setSidebarOpen(true)} className="text-zinc-400 hover:text-white"><Menu size={20} /></button>
          <span className="text-white text-[10px] uppercase tracking-widest">Admin Panel</span>
          <div className="w-5" />
        </div>
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
