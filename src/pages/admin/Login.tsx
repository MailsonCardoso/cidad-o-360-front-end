import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Lock, Mail } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulated login
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Cidadão 360</h1>
          <p className="text-muted-foreground text-sm">Área Administrativa</p>
        </div>

        {/* Login Form */}
        <div className="card-corporate">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="label-corporate">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                  className="input-corporate pl-10"
                  placeholder="admin@cidadao360.gov.br"
                />
              </div>
            </div>

            <div>
              <label htmlFor="senha" className="label-corporate">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  id="senha"
                  value={formData.senha}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, senha: e.target.value }))
                  }
                  required
                  className="input-corporate pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full">
              Entrar
            </button>
          </form>

          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-secondary hover:underline">
              Esqueceu a senha?
            </a>
          </div>
        </div>

        <p className="text-center text-muted-foreground text-sm mt-6">
          Acesso restrito a funcionários autorizados.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
