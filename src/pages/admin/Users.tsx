import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users as UsersIcon, Plus, Search, Edit, Trash2 } from "lucide-react";
import api from "../../services/api";
import { toast } from "sonner";

const Users = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchUsers = async () => {
        try {
            const { data } = await api.get("/users"); // Backend Admin Route
            if (data.success) {
                setUsers(data.data.data); // Pagination wrapper
            }
        } catch (error) {
            console.error(error);
            toast.error("Erro ao carregar usuários.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<any>(null);

    const handleDeleteClick = (user: any) => {
        setUserToDelete(user);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;

        try {
            await api.delete(`/users/${userToDelete.id}`);
            toast.success("Usuário removido com sucesso.");
            fetchUsers();
            setDeleteModalOpen(false);
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || "Erro ao excluir usuário.";
            toast.error(msg);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                        <UsersIcon className="w-8 h-8 text-secondary" />
                        Gerenciar Usuários
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Administre os usuários cadastrados no sistema.
                    </p>
                </div>
                <Link to="/admin/usuarios/cadastrar" className="btn-primary">
                    <Plus className="w-5 h-5 mr-2" />
                    Novo Usuário
                </Link>
            </div>

            {/* Filters */}
            <div className="card-corporate p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-corporate pl-10"
                    />
                </div>
            </div>

            {/* List */}
            <div className="card-corporate p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table-corporate">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Tipo</th>
                                <th className="text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8">Carregando...</td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-muted-foreground">Nenhum usuário encontrado.</td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td className="font-medium">{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            {(() => {
                                                switch (user.role) {
                                                    case 'admin':
                                                        return (
                                                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                                                Administrador
                                                            </span>
                                                        );
                                                    case 'atendimento':
                                                        return (
                                                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                                                                Atendimento
                                                            </span>
                                                        );
                                                    default:
                                                        return (
                                                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                                Usuário
                                                            </span>
                                                        );
                                                }
                                            })()}
                                            {user.setor && (
                                                <span className="ml-2 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                                    {user.setor}
                                                </span>
                                            )}
                                        </td>
                                        <td className="text-right">
                                            <Link to={`/admin/usuarios/${user.id}/editar`} className="inline-block text-secondary hover:text-secondary/80 p-2 mr-1" title="Editar">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button onClick={() => handleDeleteClick(user)} className="text-destructive hover:text-destructive/80 p-2" title="Excluir">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && userToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
                    <div className="bg-card w-full max-w-md p-6 rounded-lg shadow-xl border border-border">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                                <Trash2 className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-foreground">Excluir Usuário</h2>
                            <p className="text-muted-foreground">
                                Tem certeza que deseja excluir o usuário <span className="font-semibold text-foreground">{userToDelete.name}</span>?
                                <br />
                                Essa ação não pode ser desfeita.
                            </p>
                            <div className="flex items-center gap-3 w-full pt-4">
                                <button
                                    onClick={() => setDeleteModalOpen(false)}
                                    className="flex-1 btn-ghost"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 btn-primary bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                >
                                    Sim, Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
