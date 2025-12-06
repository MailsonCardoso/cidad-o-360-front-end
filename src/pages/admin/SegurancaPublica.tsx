import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, Filter, Search, Eye } from "lucide-react";
import Pagination from "@/components/shared/Pagination";
import api from "../../services/api";
import { toast } from "sonner";
import { statusOptions, getStatusClass } from "@/data/mockData";

const SegurancaPublica = () => {
    const [demandas, setDemandas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchDemandas = async () => {
        setLoading(true);
        try {
            // Hardcoded category filter for this screen
            const params: any = {
                page: currentPage,
                categoria: "Segurança Pública"
            };
            if (filterStatus) params.status = filterStatus;

            const { data } = await api.get("/demandas", { params });
            if (data.success) {
                setDemandas(data.data.data);
                setTotalPages(data.data.last_page);
            }
        } catch (error) {
            console.error(error);
            toast.error("Erro ao carregar demandas de Segurança Pública");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDemandas();
    }, [currentPage, filterStatus]);

    const getSolicitante = (demanda: any) => {
        if (demanda.user) return demanda.user.name;
        const match = demanda.descricao.match(/Solicitante: (.*?)(\n|$)/);
        return match ? match[1] : "Visitante";
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
                    <Shield className="w-8 h-8 text-secondary" />
                    Segurança Pública
                </h1>
                <p className="text-muted-foreground">Gerencie as demandas encaminhadas ao setor de Segurança.</p>
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

                    {/* No Category Filter - Implicitly Security Publica */}

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
                                {/* Category is redundant here */}
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
                                            // Reuse existing detail page -> it might need logic to know it came from Security Context, or we just trust the Detail page logic
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
                        <p className="text-muted-foreground">Nenhuma demanda de segurança encontrada.</p>
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

export default SegurancaPublica;
