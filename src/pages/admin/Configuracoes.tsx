import { Settings, User, Bell, Shield, Palette } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "sonner";

const AdminConfiguracoes = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    email: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

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

  const fetchUserData = async () => {
    try {
      const { data } = await api.get("/user");
      setUserData({
        id: data.id,
        name: data.name,
        email: data.email,
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
      // Update local storage user info as well just in case
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
      // Backend currently allows admin to override password. 
      // We are ignoring 'current' password check for now as backend endpoint 
      // handles direct update.
      await api.put(`/users/${userData.id}`, {
        password: passwords.new
      });
      toast.success("Senha alterada com sucesso!");
      setPasswords({ current: "", new: "", confirm: "" });
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

  if (loading) return <div className="p-8">Carregando...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          Configurações
        </h1>
        <p className="text-muted-foreground">Gerencie as configurações do sistema.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="card-corporate">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Perfil do Usuário
          </h2>

          <div className="space-y-4">
            <div>
              <label className="label-corporate">Nome</label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                className="input-corporate"
              />
            </div>
            <div>
              <label className="label-corporate">E-mail</label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                className="input-corporate"
              />
            </div>
            <button onClick={handleProfileUpdate} className="btn-primary w-full md:w-auto">
              Salvar Alterações
            </button>
          </div>
        </div>

        {/* Security Settings */}
        <div className="card-corporate">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Segurança
          </h2>

          <div className="space-y-4">
            <div>
              <label className="label-corporate">Nova Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                className="input-corporate"
              />
            </div>
            <div>
              <label className="label-corporate">Confirmar Nova Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="input-corporate"
              />
            </div>
            <button onClick={handlePasswordUpdate} className="btn-primary w-full md:w-auto">
              Alterar Senha
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card-corporate">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notificações (Local)
          </h2>

          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-foreground">Novas demandas</span>
              <input
                type="checkbox"
                checked={notifications.newDemands}
                onChange={(e) => setNotifications({ ...notifications, newDemands: e.target.checked })}
                className="w-5 h-5 text-primary rounded focus:ring-primary"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-foreground">Atualizações de status</span>
              <input
                type="checkbox"
                checked={notifications.statusUpdates}
                onChange={(e) => setNotifications({ ...notifications, statusUpdates: e.target.checked })}
                className="w-5 h-5 text-primary rounded focus:ring-primary"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-foreground">Relatórios semanais</span>
              <input
                type="checkbox"
                checked={notifications.weeklyReports}
                onChange={(e) => setNotifications({ ...notifications, weeklyReports: e.target.checked })}
                className="w-5 h-5 text-primary rounded focus:ring-primary"
              />
            </label>
            <button onClick={saveLocalSettings} className="btn-outline w-full md:w-auto text-sm">
              Salvar Preferências
            </button>
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
            <button onClick={saveLocalSettings} className="btn-outline w-full md:w-auto text-sm">
              Salvar Preferências
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminConfiguracoes;
