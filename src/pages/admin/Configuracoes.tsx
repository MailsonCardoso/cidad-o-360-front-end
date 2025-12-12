import { Settings, User, Bell, Shield, Palette } from "lucide-react";


const AdminConfiguracoes = () => {
  // const { theme, setTheme } = useTheme();

  // const updateTheme = (newTheme: any) => {
  //   setTheme(newTheme);
  // };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
          <Settings className="w-8 h-8 text-secondary" />
          Configurações
        </h1>
        <p className="text-muted-foreground">Gerencie as configurações do sistema.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="card-corporate">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-secondary" />
            Perfil do Usuário
          </h2>

          <div className="space-y-4">
            <div>
              <label className="label-corporate">Nome</label>
              <input
                type="text"
                defaultValue="Administrador"
                className="input-corporate"
              />
            </div>
            <div>
              <label className="label-corporate">E-mail</label>
              <input
                type="email"
                defaultValue="admin@cidadao360.gov.br"
                className="input-corporate"
              />
            </div>
            <button className="btn-primary">Salvar Alterações</button>
          </div>
        </div>

        {/* Security Settings */}
        <div className="card-corporate">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-secondary" />
            Segurança
          </h2>

          <div className="space-y-4">
            <div>
              <label className="label-corporate">Senha Atual</label>
              <input
                type="password"
                placeholder="••••••••"
                className="input-corporate"
              />
            </div>
            <div>
              <label className="label-corporate">Nova Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                className="input-corporate"
              />
            </div>
            <div>
              <label className="label-corporate">Confirmar Nova Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                className="input-corporate"
              />
            </div>
            <button className="btn-primary">Alterar Senha</button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card-corporate">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-secondary" />
            Notificações
          </h2>

          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-foreground">Novas demandas</span>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-secondary rounded focus:ring-secondary"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-foreground">Atualizações de status</span>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-secondary rounded focus:ring-secondary"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-foreground">Relatórios semanais</span>
              <input
                type="checkbox"
                className="w-5 h-5 text-secondary rounded focus:ring-secondary"
              />
            </label>
          </div>
        </div>

        {/* System Settings */}
        <div className="card-corporate">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-secondary" />
            Sistema
          </h2>

          <div className="space-y-4">

            <div>
              <label className="label-corporate">Idioma</label>
              <select className="input-corporate">
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
            <div>
              <label className="label-corporate">Fuso Horário</label>
              <select className="input-corporate">
                <option value="America/Sao_Paulo">Brasília (UTC-3)</option>
                <option value="America/Manaus">Manaus (UTC-4)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminConfiguracoes;
