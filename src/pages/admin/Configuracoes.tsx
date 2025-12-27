import { Settings, User, Bell, Shield, Palette, Lock, Camera } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

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

  useEffect(() => {
    fetchUserData();
    loadLocalSettings();
  }, []);

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
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          Configurações
        </h1>
        <p className="text-muted-foreground">Gerencie sua conta e preferências do sistema.</p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="account">Minha Conta</TabsTrigger>
          <TabsTrigger value="preferences">Preferências</TabsTrigger>
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
      </Tabs>
    </div>
  );
};

export default AdminConfiguracoes;
