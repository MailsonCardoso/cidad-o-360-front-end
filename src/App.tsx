import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import PublicLayout from "@/components/layout/PublicLayout";
import AdminLayout from "@/components/layout/AdminLayout";

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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
            <Route path="demandas" element={<AdminDemandas />} />
            <Route path="demandas/:id" element={<AdminDemandaDetalhe />} />
            <Route path="comunicados" element={<AdminComunicados />} />
            <Route path="configuracoes" element={<AdminConfiguracoes />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
