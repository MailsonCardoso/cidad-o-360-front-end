import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import PublicLayout from "@/components/layout/PublicLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import ThemeManager from "@/components/ThemeManager";

// Public Pages
import Index from "@/pages/Index";
import RegistrarDemanda from "@/pages/RegistrarDemanda";
import ConsultarProtocolo from "@/pages/ConsultarProtocolo";
import Comunicados from "@/pages/Comunicados";
import ComunicadoDetalhe from "@/pages/ComunicadoDetalhe";
import Sobre from "@/pages/Sobre";
import NotFound from "@/pages/NotFound";

// Admin Pages
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminDemandas from "@/pages/admin/Demandas";
import AdminDemandaDetalhe from "@/pages/admin/DemandaDetalhe";
import AdminComunicados from "@/pages/admin/Comunicados";
import AdminConfiguracoes from "@/pages/admin/Configuracoes";
import AdminUserCreate from "@/pages/admin/UserCreate";
import AdminUsers from "@/pages/admin/Users";
import AdminUserEdit from "@/pages/admin/UserEdit";
import AdminSegurancaPublica from "@/pages/admin/SegurancaPublica";
import AdminSetorDemandas from "@/pages/admin/SetorDemandas";
import AdminChangePassword from "@/pages/admin/ChangePassword";
import AdminCadastroDemanda from "@/pages/admin/CadastroDemanda"; // Import new page
import AdminQualidade from "@/pages/admin/Qualidade";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeManager />
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/registrar-demanda" element={<RegistrarDemanda />} />
            <Route path="/consultar-protocolo" element={<ConsultarProtocolo />} />
            <Route path="/comunicados" element={<Comunicados />} />
            <Route path="/comunicados/:id" element={<ComunicadoDetalhe />} />
            <Route path="/sobre" element={<Sobre />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="qualidade" element={<AdminQualidade />} />
            <Route path="demandas" element={<AdminDemandas />} />
            <Route path="cadastro" element={<AdminCadastroDemanda />} />
            <Route path="demandas/:id" element={<AdminDemandaDetalhe />} />
            <Route path="comunicados" element={<AdminComunicados />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="usuarios" element={<AdminUsers />} />
            <Route path="usuarios/cadastrar" element={<AdminUserCreate />} />
            <Route path="usuarios/:id/editar" element={<AdminUserEdit />} />
            <Route path="seguranca-publica" element={<AdminSegurancaPublica />} />
            <Route path="setor/:categoria" element={<AdminSetorDemandas />} />
            <Route path="alterar-senha" element={<AdminChangePassword />} />
            <Route path="configuracoes" element={<AdminConfiguracoes />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
