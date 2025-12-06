import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Save, X } from "lucide-react";
import api from "../../services/api";
import { toast } from "sonner";

const ChangePassword = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            toast.error("As senhas não conferem.");
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            toast.error("A senha deve ter pelo menos 6 caracteres.");
            setLoading(false);
            return;
        }

        try {
            // Use the generic update endpoint - typically users can update themselves or we have a specific profile endpoint
            // Assuming we need to use /users/{id} for now, which UserEdit uses.
            // Ideally backend should have a /profile endpoint or allow self-update.
            // Based on previous UserController, update requires ID.

            const payload = {
                password: formData.password
            };

            await api.put(`/users/${user.id}`, payload);
            toast.success("Senha alterada com sucesso!");
            navigate("/admin/dashboard");

        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || "Erro ao alterar senha.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                    <Lock className="w-8 h-8 text-secondary" />
                    Alterar Senha
                </h1>
                <p className="text-muted-foreground mt-2">
                    Defina uma nova senha para sua conta.
                </p>
            </div>

            {/* Form Card */}
            <div className="card-corporate max-w-xl">
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="grid grid-cols-1 gap-4">
                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="label-corporate">
                                Nova Senha *
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="input-corporate"
                                placeholder="******"
                                minLength={6}
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="label-corporate">
                                Confirmar Nova Senha *
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="input-corporate"
                                placeholder="******"
                                minLength={6}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                        <Link
                            to="/admin/dashboard"
                            className="btn-ghost flex items-center px-4 py-2"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex items-center px-6 py-2"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {loading ? "Salvar" : "Salvar"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
