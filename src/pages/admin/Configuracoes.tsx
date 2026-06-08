import { Settings, User, Bell, Shield, Palette, Lock, Camera, Paintbrush } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { themeService, ThemeSettings } from "@/services/themeService";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const AdminConfiguracoes = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    email: "",
    avatar: "", // Mock URL or future support
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // Password Strength
  const [strength, setStrength] = useState(0);

  // Local settings
  const [notifications, setNotifications] = useState({
    newDemands: true,
    statusUpdates: true,
    weeklyReports: false,
  });

  const [system, setSystem] = useState({
    language: "pt-BR",
    timezone: "America/Sao_Paulo",
  });

  const queryClient = useQueryClient();
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    theme_primary_color: "#3b82f6",
    theme_secondary_color: "#1e40af",
    theme_accent_color: "#f59e0b",
    theme_background_color: "#ffffff",
    theme_sidebar_color: "#1f2937",
  });
  const [savingTheme, setSavingTheme] = useState(false);

  useEffect(() => {
    fetchUserData();
    loadLocalSettings();
    fetchThemeSettings();
  }, []);

  const fetchThemeSettings = async () => {
    try {
      const data = await themeService.getTheme();
      setThemeSettings(data);
    } catch (error) {
      console.error("Erro ao carregar tema:", error);
    }
  };

  const handleThemeUpdate = async () => {
    setSavingTheme(true);
    try {
      await themeService.updateTheme(themeSettings);
      toast.success("Tema global atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['globalTheme'] });
    } catch (error: any) {
      console.error("Erro ao salvar tema global:", error);
      const message = error.response?.data?.message || "Erro ao salvar tema global";
      toast.error(message);
    } finally {
      setSavingTheme(false);
    }
  };

  useEffect(() => {
    calculateStrength(passwords.new);
  }, [passwords.new]);

  const calculateStrength = (password: string) => {
    let score = 0;
    if (!password) {
      setStrength(0);
      return;
    }
    if (password.length > 5) score += 1;
    if (password.length > 7) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    setStrength(score);
  };

  const getStrengthColor = () => {
    if (strength === 0) return "bg-gray-200";
    if (strength <= 2) return "bg-red-500";
    if (strength === 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (strength === 0) return "";
    if (strength <= 2) return "Fraca";
    if (strength === 3) return "Média";
    return "Forte";
  };

  const fetchUserData = async () => {
    try {
      const { data } = await api.get("/user");
      setUserData({
        id: data.id,
        name: data.name,
        email: data.email,
        avatar: "", // No backend support yet
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar dados do usuário");
    } finally {
      setLoading(false);
    }
  };

  const loadLocalSettings = () => {
    const savedNotifs = localStorage.getItem('admin_notifications');
    if (savedNotifs) setNotifications(JSON.parse(savedNotifs));

    const savedSystem = localStorage.getItem('admin_system_settings');
    if (savedSystem) setSystem(JSON.parse(savedSystem));
  }

  const handleProfileUpdate = async () => {
    if (!userData.name || !userData.email) {
      toast.error("Nome e E-mail são obrigatórios");
      return;
    }

    try {
      await api.put(`/users/${userData.id}`, {
        name: userData.name,
        email: userData.email,
      });
      toast.success("Perfil atualizado com sucesso!");
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...storedUser, name: userData.name, email: userData.email }));
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar perfil");
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwords.new) {
      toast.error("Digite a nova senha");
      return;
    }
    if (passwords.new.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error("As senhas não conferem");
      return;
    }

    try {
      await api.put(`/users/${userData.id}`, {
        password: passwords.new
      });
      toast.success("Senha alterada com sucesso!");
      setPasswords({ current: "", new: "", confirm: "" });
      setStrength(0);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao alterar senha");
    }
  };

  const saveLocalSettings = () => {
    localStorage.setItem('admin_notifications', JSON.stringify(notifications));
    localStorage.setItem('admin_system_settings', JSON.stringify(system));
    toast.success("Preferências salvas localmente");
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="w-full">
          <Skeleton className="h-10 w-[400px] mb-6" /> {/* Tabs List */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Card Skeleton */}
            <div className="card-corporate h-[400px] space-y-6">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="flex flex-col items-center space-y-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* Security Card Skeleton */}
            <div className="card-corporate h-[400px] space-y-6">
              <Skeleton className="h-6 w-28 mb-6" />
              <Skeleton className="h-12 w-full mb-4" /> {/* Alert */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Configurações</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          Configurações
        </h1>
        <p className="text-muted-foreground">Gerencie sua conta e preferências do sistema.</p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
          <TabsTrigger value="account">Minha Conta</TabsTrigger>
          <TabsTrigger value="preferences">Preferências</TabsTrigger>
          <TabsTrigger value="theme">Customização</TabsTrigger>
        </TabsList>

        {/* Tab: Minha Conta */}
        <TabsContent value="account" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Profile Card */}
            <div className="card-corporate">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Perfil
                </h2>
              </div>

              <div className="flex flex-col items-center mb-8">
                <div className="relative group cursor-pointer">
                  <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
                    <AvatarImage src={userData.avatar} />
                    <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                      {getInitials(userData.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Clique para alterar (simulação)</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label-corporate">Nome Completo</label>
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    className="input-corporate"
                  />
                </div>
                <div>
                  <label className="label-corporate">Endereço de E-mail</label>
                  <input
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    className="input-corporate"
                  />
                </div>
                <button onClick={handleProfileUpdate} className="btn-primary w-full">
                  Salvar Perfil
                </button>
              </div>
            </div>

            {/* Security Card */}
            <div className="card-corporate">
              <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Segurança
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg border border-border mb-4">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Lock className="w-4 h-4" />
                    <span>Sua senha deve ter no mínimo 6 caracteres.</span>
                  </div>
                </div>

                <div>
                  <label className="label-corporate">Nova Senha</label>
                  <input
                    type="password"
                    placeholder="Digita a nova senha"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    className="input-corporate"
                  />
                  {/* Password Strength Meter */}
                  {passwords.new && (
                    <div className="mt-2 text-xs">
                      <div className="flex justify-between mb-1">
                        <span>Força da senha:</span>
                        <span className={`font-semibold ${strength <= 2 ? 'text-red-500' : strength === 3 ? 'text-yellow-500' : 'text-green-500'
                          }`}>
                          {getStrengthText()}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                          style={{ width: `${(strength / 4) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="label-corporate">Confirmar Nova Senha</label>
                  <input
                    type="password"
                    placeholder="Repita a nova senha"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    className="input-corporate"
                  />
                </div>

                <div className="pt-2">
                  <button onClick={handlePasswordUpdate} className="btn-primary w-full">
                    Atualizar Senha
                  </button>
                </div>
              </div>
            </div>

          </div>
        </TabsContent>

        {/* Tab: Preferências */}
        <TabsContent value="preferences" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Notification Settings */}
            <div className="card-corporate">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notificações (Local)
              </h2>

              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="text-foreground">Novas demandas</span>
                  <input
                    type="checkbox"
                    checked={notifications.newDemands}
                    onChange={(e) => setNotifications({ ...notifications, newDemands: e.target.checked })}
                    className="w-5 h-5 text-primary rounded focus:ring-primary"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="text-foreground">Atualizações de status</span>
                  <input
                    type="checkbox"
                    checked={notifications.statusUpdates}
                    onChange={(e) => setNotifications({ ...notifications, statusUpdates: e.target.checked })}
                    className="w-5 h-5 text-primary rounded focus:ring-primary"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="text-foreground">Relatórios semanais</span>
                  <input
                    type="checkbox"
                    checked={notifications.weeklyReports}
                    onChange={(e) => setNotifications({ ...notifications, weeklyReports: e.target.checked })}
                    className="w-5 h-5 text-primary rounded focus:ring-primary"
                  />
                </label>
              </div>
            </div>

            {/* System Settings */}
            <div className="card-corporate">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                Sistema (Local)
              </h2>

              <div className="space-y-4">

                <div>
                  <label className="label-corporate">Idioma</label>
                  <select
                    value={system.language}
                    onChange={(e) => setSystem({ ...system, language: e.target.value })}
                    className="input-corporate"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
                <div>
                  <label className="label-corporate">Fuso Horário</label>
                  <select
                    value={system.timezone}
                    onChange={(e) => setSystem({ ...system, timezone: e.target.value })}
                    className="input-corporate"
                  >
                    <option value="America/Sao_Paulo">Brasília (UTC-3)</option>
                    <option value="America/Manaus">Manaus (UTC-4)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button onClick={saveLocalSettings} className="btn-primary w-full md:w-auto">
              Salvar Preferências
            </button>
          </div>
        </TabsContent>

        {/* Tab: Customização */}
        <TabsContent value="theme" className="mt-6 space-y-6">
          <div className="card-corporate">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Paintbrush className="w-5 h-5 text-primary" />
                Tema Global do Sistema
              </h2>
              <p className="text-sm text-muted-foreground">
                Selecione uma das paletas profissionais abaixo para aplicar a todos os usuários.
              </p>
            </div>

            {/* Grid de Paletas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {[
                {
                  id: 'oceanic',
                  name: 'Oceanic Corporate',
                  description: 'Confiança e sobriedade para gestão pública.',
                  colors: {
                    theme_primary_color: '#2563EB',
                    theme_secondary_color: '#64748B',
                    theme_accent_color: '#F59E0B',
                    theme_background_color: '#F8FAFC',
                    theme_sidebar_color: '#0F172A',
                  }
                },
                {
                  id: 'tech',
                  name: 'Tech Indigo',
                  description: 'Vibrante, moderno e focado em tecnologia.',
                  colors: {
                    theme_primary_color: '#6366F1',
                    theme_secondary_color: '#94A3B8',
                    theme_accent_color: '#EC4899',
                    theme_background_color: '#F1F5F9',
                    theme_sidebar_color: '#1E1B4B',
                  }
                },
                {
                  id: 'emerald',
                  name: 'Emerald Eco',
                  description: 'Vitalidade e transparência sustentável.',
                  colors: {
                    theme_primary_color: '#059669',
                    theme_secondary_color: '#6B7280',
                    theme_accent_color: '#8B5CF6',
                    theme_background_color: '#F9FAFB',
                    theme_sidebar_color: '#064E3B',
                  }
                },
                {
                  id: 'minimalist',
                  name: 'Slate Minimalist',
                  description: 'Extremamente arejado com sidebar branca.',
                  colors: {
                    theme_primary_color: '#0F172A',
                    theme_secondary_color: '#475569',
                    theme_accent_color: '#10B981',
                    theme_background_color: '#F1F5F9',
                    theme_sidebar_color: '#0F172A',
                  }
                },
                {
                  id: 'bordeaux',
                  name: 'Bordeaux Executive',
                  description: 'Sofisticação e tradição executiva.',
                  colors: {
                    theme_primary_color: '#991B1B',
                    theme_secondary_color: '#525252',
                    theme_accent_color: '#D97706',
                    theme_background_color: '#FAFAFA',
                    theme_sidebar_color: '#450A0A',
                  }
                },
                {
                  id: 'ruby',
                  name: 'Ruby Vermelho',
                  description: 'Vermelho vibrante com contraste elegante.',
                  colors: {
                    theme_primary_color: '#D62828',
                    theme_secondary_color: '#C0C0C0',
                    theme_accent_color: '#9D0208',
                    theme_background_color: '#FFFFFF',
                    theme_sidebar_color: '#1A1A1A',
                  }
                }
              ].map((theme) => {
                const isSelected =
                  themeSettings.theme_primary_color.toUpperCase() === theme.colors.theme_primary_color.toUpperCase() &&
                  themeSettings.theme_sidebar_color.toUpperCase() === theme.colors.theme_sidebar_color.toUpperCase();

                return (
                  <div
                    key={theme.id}
                    onClick={() => setThemeSettings(theme.colors)}
                    className={`cursor-pointer group relative p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${isSelected
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                      : 'border-transparent bg-muted/10 hover:bg-muted/20'
                      }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className={`font-bold transition-colors ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                        {theme.name}
                      </h3>
                      {isSelected && (
                        <div className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center animate-scale-in">
                          <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z" /></svg>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                      {theme.description}
                    </p>

                    <div className="flex items-center gap-1.5 p-2 bg-background/50 rounded-lg border border-border/50">
                      <div className="w-6 h-6 rounded shadow-sm" style={{ backgroundColor: theme.colors.theme_primary_color }} title="Primária" />
                      <div className="w-6 h-6 rounded shadow-sm" style={{ backgroundColor: theme.colors.theme_secondary_color }} title="Secundária" />
                      <div className="w-6 h-6 rounded shadow-sm" style={{ backgroundColor: theme.colors.theme_accent_color }} title="Destaque" />
                      <div className="w-6 h-6 rounded shadow-sm border border-border" style={{ backgroundColor: theme.colors.theme_background_color }} title="Fundo" />
                      <div className="w-6 h-6 rounded shadow-sm" style={{ backgroundColor: theme.colors.theme_sidebar_color }} title="Sidebar" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 p-8 rounded-2xl border border-dashed border-border bg-muted/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-primary rounded-full" />
                <h3 className="font-semibold text-lg text-foreground">Pré-visualização da Paleta Selecionada</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Botões e Ações</p>
                  <div className="flex flex-wrap gap-3">
                    <button className="px-5 py-2.5 rounded-lg text-white text-sm font-medium shadow-sm transition-opacity hover:opacity-90" style={{ backgroundColor: themeSettings.theme_primary_color }}>
                      Primário
                    </button>
                    <button className="px-5 py-2.5 rounded-lg text-white text-sm font-medium shadow-sm transition-opacity hover:opacity-90" style={{ backgroundColor: themeSettings.theme_secondary_color }}>
                      Secundário
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Interface e Destaques</p>
                  <div className="flex flex-wrap gap-3">
                    <div className="px-4 py-2 rounded-full text-white text-xs font-bold" style={{ backgroundColor: themeSettings.theme_accent_color }}>
                      ITEM EM DESTAQUE
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-primary" style={{ borderColor: themeSettings.theme_primary_color }} />
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Navegação e Fundo</p>
                  <div className="flex gap-4">
                    <div className="w-14 h-20 rounded-lg shadow-inner overflow-hidden border border-border" style={{ backgroundColor: themeSettings.theme_background_color }}>
                      <div className="w-4 h-full" style={{ backgroundColor: themeSettings.theme_sidebar_color }} />
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-2 leading-relaxed italic">
                      Visual conceptual de como cores<br />se comportam na UI.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-10 border-t border-border mt-10">
              <button
                onClick={handleThemeUpdate}
                disabled={savingTheme}
                className="btn-primary w-full md:w-[240px] h-12 flex items-center justify-center gap-2"
              >
                {savingTheme ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Paintbrush className="w-4 h-4" />
                    Aplicar Tema Global
                  </>
                )}
              </button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminConfiguracoes;
