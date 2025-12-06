import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Megaphone,
  Settings,
  LogOut,
  Building2,
  Menu,
  X,
  Users as UsersIcon,
  Shield,
  FolderOpen,
  FilePlus
} from "lucide-react";
import { useState } from "react";
import { categories } from "@/data/mockData";

const AdminSidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Get User from storage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === 'admin';
  const isDispatcher = user.role === 'atendimento';

  // Base Menu
  const menuItems = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      visible: isAdmin // Strictly Admin only
    },
    {
      href: "/admin/demandas",
      label: "Demandas",
      icon: FileText,
      visible: isAdmin || isDispatcher || !user.setor
    },
    {
      href: "/admin/cadastro",
      label: "Cadastro",
      icon: FilePlus,
      visible: isDispatcher // Only for Atendimento
    },
    {
      href: "/admin/comunicados",
      label: "Comunicados",
      icon: Megaphone,
      visible: isAdmin || (!user.setor && !isDispatcher) // Hide for Dispatcher
    },
    {
      href: "/admin/usuarios",
      label: "Usuários",
      icon: UsersIcon,
      visible: isAdmin || (!user.setor && !isDispatcher) // Hide for Dispatcher
    },
    {
      href: "/admin/configuracoes",
      label: "Configurações",
      icon: Settings,
      visible: isAdmin
    },
  ];

  // Dynamic Sector Links
  const sectorLinks = categories.map(cat => ({
    href: `/admin/setor/${encodeURIComponent(cat)}`,
    label: cat,
    icon: cat === "Segurança Pública" ? Shield : FolderOpen,
    visible: isAdmin || user.setor === cat
  }));

  const allLinks = [...menuItems, ...sectorLinks];
  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-sidebar rounded-lg text-sidebar-foreground"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-sidebar transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-sidebar-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-sidebar-foreground">Cidadão 360</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {allLinks.filter(item => item.visible).map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`sidebar-item ${isActive(item.href) ? "sidebar-item-active" : ""}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-sidebar-border">
            <Link
              to="/admin/login"
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
              }}
              className="sidebar-item text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-5 h-5" />
              <span>Sair</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
