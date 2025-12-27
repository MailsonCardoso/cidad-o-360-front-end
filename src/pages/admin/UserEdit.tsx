import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserCog, Save, X } from "lucide-react";
import api from "../../services/api";
import { toast } from "sonner";
import { categories } from "@/data/mockData";

const UserEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "", // Optional on edit
        confirmPassword: "",
        role: "user",
        setor: "",
    });

    const [strength, setStrength] = useState(0);

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

    useEffect(() => {
        calculateStrength(formData.password);
    }, [formData.password]);

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

    // UI Render below password input
    const renderStrengthMeter = () => (
        formData.password && (
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
        )
    );

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await api.get(`/users/${id}`);
                if (data.success) {
                    const user = data.data;
                    setFormData({
                        name: user.name,
                        email: user.email,
                        password: "",
                        confirmPassword: "",
                        role: user.role,
                        setor: user.setor || "",
                    });
                }
            } catch (error) {
                console.error(error);
                toast.error("Erro ao carregar dados do usuário.");
                navigate("/admin/usuarios");
            } finally {
                setFetching(false);
            }
        };

        if (id) fetchUser();
    }, [id, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Validate only if password field is filled
        if (formData.password && formData.password !== formData.confirmPassword) {
            toast.error("As senhas não conferem.");
            setLoading(false);
            return;
        }

        if (formData.password && formData.password.length < 6) {
            toast.error("A senha deve ter pelo menos 6 caracteres.");
            setLoading(false);
            return;
        }

        try {
            const payload: any = {
                name: formData.name,
                email: formData.email,
                role: formData.role,
                setor: formData.setor || null,
            };

            if (formData.password) {
                payload.password = formData.password;
            }

            await api.put(`/users/${id}`, payload);
            toast.success("Usuário atualizado com sucesso!");
            navigate("/admin/usuarios");

        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || "Erro ao atualizar usuário.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-8 text-center text-muted-foreground">Carregando usuário...</div>;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                    <UserCog className="w-8 h-8 text-secondary" />
                    Editar Usuário
                </h1>
                <p className="text-muted-foreground mt-2">
                    Atualize os dados do usuário. Deixe a senha em branco para mantê-la.
                </p>
            </div>

            {/* Form Card */}
            <div className="card-corporate max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="label-corporate">
                            Nome Completo *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="input-corporate"
                            placeholder="Ex: João da Silva"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="label-corporate">
                            E-mail *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="input-corporate"
                        />
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="role" className="label-corporate">
                                Tipo de Usuário *
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="input-corporate"
                            >
                                <option value="user">Usuário</option>
                                <option value="admin">Administrador</option>
                                <option value="atendimento">Atendimento (Triagem)</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="setor" className="label-corporate">
                                Setor Responsável
                            </label>
                            <select
                                id="setor"
                                name="setor"
                                value={formData.setor}
                                onChange={handleChange}
                                className="input-corporate"
                            >
                                <option value="">Nenhum</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="label-corporate">
                                Nova Senha (Opcional)
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input-corporate"
                                placeholder="Deixe em branco para manter"
                                minLength={6}
                            />
                            {renderStrengthMeter()}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="label-corporate">
                                Confirmar Nova Senha
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="input-corporate"
                                placeholder="Repita a nova senha"
                                minLength={6}
                                required={!!formData.password} // Required only if password is set
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                        <Link
                            to="/admin/usuarios"
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
                            {loading ? "Salvando..." : "Salvar"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default UserEdit;
