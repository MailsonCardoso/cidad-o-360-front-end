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
  FilePlus,
  Globe,
  Star
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

  // Grouped Menu Structure
  const mainGroups = [
    {
      title: "ATENDIMENTO",
      items: [
        { href: "/admin/demandas", label: "Todas as Demandas", icon: FileText, visible: isAdmin || isDispatcher || !user.setor },
        { href: "/admin/cadastro", label: "Novo Atendimento", icon: FilePlus, visible: isDispatcher },
      ]
    },
    {
      title: "GESTÃO",
      items: [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, visible: isAdmin },
        { href: "/admin/qualidade", label: "Qualidade", icon: Star, visible: isAdmin },
        { href: "/admin/comunicados", label: "Comunicados", icon: Megaphone, visible: isAdmin || (!user.setor && !isDispatcher) },
      ]
    }
  ];

  const systemGroup = {
    title: "SISTEMA",
    items: [
      { href: "/admin/usuarios", label: "Equipe", icon: UsersIcon, visible: isAdmin },
      { href: "/admin/configuracoes", label: "Configurações", icon: Settings, visible: isAdmin },
    ]
  };

  // Dynamic Sector Links
  const sectorLinks = categories.map(cat => ({
    href: `/admin/setor/${encodeURIComponent(cat)}`,
    label: cat,
    icon: cat === "Segurança Pública" ? Shield : FolderOpen,
    visible: isAdmin || user.setor === cat
  }));

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-[#0f2537] text-white rounded-lg shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-[#0f2537] text-white border-r border-[#1e3a52]
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        flex flex-col
      `}>
        {/* Logo Area */}
        <div className="p-6 border-b border-[#1e3a52]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none text-white">Cidadão 360</h1>
              <span className="text-xs text-blue-200">Painel Administrativo</span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-6">

          {/* Main Groups */}
          {mainGroups.map((group, groupIndex) => (
            group.items.some(item => item.visible) && (
              <div key={groupIndex}>
                <h3 className="px-4 text-xs font-semibold text-blue-300/70 uppercase tracking-wider mb-2">
                  {group.title}
                </h3>
                <nav className="space-y-1">
                  {group.items.filter(item => item.visible).map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                        ${isActive(item.href)
                          ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                          : "text-blue-100 hover:bg-white/10 hover:text-white hover:translate-x-1"}
                      `}
                    >
                      <item.icon className={`w-4 h-4 ${isActive(item.href) ? "text-white" : "text-blue-200"}`} />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            )
          ))}

          {/* Sectors Section */}
          {(isAdmin || user.setor) && (
            <div>
              <h3 className="px-4 text-xs font-semibold text-blue-300/70 uppercase tracking-wider mb-2">
                ÁREAS / SETORES
              </h3>
              <nav className="space-y-1">
                {sectorLinks.filter(item => item.visible).map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive(item.href)
                        ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                        : "text-blue-100 hover:bg-white/10 hover:text-white hover:translate-x-1"}
                    `}
                  >
                    <item.icon className="w-4 h-4 opacity-70 text-blue-200" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          )}

          {/* System Group */}
          {systemGroup.items.some(item => item.visible) && (
            <div>
              <h3 className="px-4 text-xs font-semibold text-blue-300/70 uppercase tracking-wider mb-2">
                {systemGroup.title}
              </h3>
              <nav className="space-y-1">
                {systemGroup.items.filter(item => item.visible).map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive(item.href)
                        ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                        : "text-blue-100 hover:bg-white/10 hover:text-white hover:translate-x-1"}
                    `}
                  >
                    <item.icon className={`w-4 h-4 ${isActive(item.href) ? "text-white" : "text-blue-200"}`} />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#1e3a52] space-y-2 bg-[#0a1a29]/30">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/admin/login";
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair do Sistema
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
