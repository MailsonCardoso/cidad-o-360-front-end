import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Shield, Filter, Search, Eye, FolderOpen } from "lucide-react";
import Pagination from "@/components/shared/Pagination";
import api from "../../services/api";
import { toast } from "sonner";
import { statusOptions, getStatusClass } from "@/data/mockData";

const SetorDemandas = () => {
    // Get category from URL params using React Router
    // Route will be /admin/setor/:categoria
    const { categoria } = useParams<{ categoria: string }>();

    // Format category for display (It might come URL encoded or as slug)
    // For simplicity, we assume the route sends the exact string or we decode it.
    // Actually, passing raw strings in URLs is tricky. 
    // Let's assume the Dashboard/Sidebar links pass the encoded string.
    const displayCategoria = categoria ? decodeURIComponent(categoria) : "Setor";

    const [demandas, setDemandas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchDemandas = async () => {
        if (!categoria) return;

        setLoading(true);
        try {
            const params: any = {
                page: currentPage,
                categoria: displayCategoria // Filter by this specific sector
            };
            if (filterStatus) params.status = filterStatus;

            const { data } = await api.get("/demandas", { params });
            if (data.success) {
                setDemandas(data.data.data);
                setTotalPages(data.data.last_page);
            }
        } catch (error) {
            console.error(error);
            toast.error(`Erro ao carregar demandas de ${displayCategoria}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDemandas();
        // Reset page when category changes
        setCurrentPage(1);
    }, [categoria, currentPage, filterStatus]);

    const getSolicitante = (demanda: any) => {
        if (demanda.user) return demanda.user.name;
        // More robust regex to handle variations in spacing and line endings
        const match = demanda.descricao?.match(/Solicitante\s*:\s*(.*?)(?:\n|\r|$)/i);
        return match ? match[1].trim() : "Visitante";
    };

    const filteredDemandas = demandas.filter((demanda) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            demanda.protocolo?.toLowerCase().includes(term) ||
            demanda.assunto?.toLowerCase().includes(term) ||
            getSolicitante(demanda).toLowerCase().includes(term)
        );
    });

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                    {displayCategoria === "Segurança Pública" ? (
                        <Shield className="w-8 h-8 text-secondary" />
                    ) : (
                        <FolderOpen className="w-8 h-8 text-secondary" />
                    )}
                    {displayCategoria}
                </h1>
                <p className="text-muted-foreground">Gerencie as demandas encaminhadas ao setor de {displayCategoria}.</p>
            </div>

            {/* Filters */}
            <div className="card-corporate">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium text-foreground">Filtros</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Buscar por protocolo..."
                            className="input-corporate pl-10"
                        />
                    </div>

                    <select
                        value={filterStatus}
                        onChange={(e) => {
                            setFilterStatus(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="input-corporate"
                    >
                        <option value="">Todos os status</option>
                        {statusOptions.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => {
                            setSearchTerm("");
                            setFilterStatus("");
                            setCurrentPage(1);
                        }}
                        className="btn-outline text-sm"
                    >
                        Limpar Filtros
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="card-corporate overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table-corporate">
                        <thead>
                            <tr>
                                <th className="rounded-tl-lg">Protocolo</th>
                                <th>Nome</th>
                                <th>Status</th>
                                <th className="hidden md:table-cell">Data</th>
                                <th className="rounded-tr-lg">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDemandas.map((demanda) => (
                                <tr key={demanda.id}>
                                    <td>
                                        <span className="font-medium text-secondary">{demanda.protocolo}</span>
                                    </td>
                                    <td>
                                        <div>
                                            <p className="text-foreground font-medium">{getSolicitante(demanda)}</p>
                                            <p className="text-muted-foreground text-sm truncate max-w-[200px]">
                                                {demanda.assunto}
                                            </p>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(demanda.status)}`}>
                                            {demanda.status}
                                        </span>
                                    </td>
                                    <td className="hidden md:table-cell text-muted-foreground">
                                        {new Date(demanda.created_at).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <Link
                                            to={`/admin/demandas/${demanda.id}`}
                                            className="inline-flex items-center gap-1 text-secondary hover:underline text-sm font-medium"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Ver
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredDemandas.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Nenhuma demanda encontrada para este setor.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
};

export default SetorDemandas;
