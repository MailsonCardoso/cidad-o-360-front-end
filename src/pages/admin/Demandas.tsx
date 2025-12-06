import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, Filter, Search, Eye, ArrowRight, X } from "lucide-react";
import Pagination from "@/components/shared/Pagination";
import api from "../../services/api";
import { toast } from "sonner";
import { categories, statusOptions, getStatusClass } from "@/data/mockData";

const AdminDemandas = () => {
  const [demandas, setDemandas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDemandas = async () => {
    setLoading(true);
    try {
      const params: any = { page: currentPage };
      if (filterCategoria) params.categoria = filterCategoria;
      if (filterStatus) params.status = filterStatus;

      const { data } = await api.get("/demandas", { params });
      if (data.success) {
        setDemandas(data.data.data);
        setTotalPages(data.data.last_page);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar demandas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemandas();
  }, [currentPage, filterCategoria, filterStatus]);

  // Helper to extract name from description if user is null
  const getSolicitante = (demanda: any) => {
    if (demanda.user) return demanda.user.name;
    // More robust regex to handle variations in spacing and line endings
    const match = demanda.descricao?.match(/Solicitante\s*:\s*(.*?)(?:\n|\r|$)/i);
    return match ? match[1].trim() : "Visitante";
  };

  // Dispatcher Logic
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isDispatcher = user.role === 'atendimento';
  const [forwardModalOpen, setForwardModalOpen] = useState(false);
  const [demandaToForward, setDemandaToForward] = useState<any>(null);
  const [selectedSector, setSelectedSector] = useState("");

  const handleForwardClick = (demanda: any) => {
    setDemandaToForward(demanda);
    setSelectedSector("");
    setForwardModalOpen(true);
  };

  const handleForwardSubmit = async () => {
    if (!demandaToForward || !selectedSector) return;

    try {
      // Backend automatically updates category based on "Encaminhada para [Setor]"
      await api.put(`/demandas/${demandaToForward.id}`, {
        status: `Encaminhada para ${selectedSector}`,
        descricao: demandaToForward.descricao // Keep description
      });
      toast.success(`Demanda encaminhada para ${selectedSector}`);
      setForwardModalOpen(false);
      fetchDemandas();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao encaminhar demanda.");
    }
  };

  const filteredDemandas = demandas.filter((demanda) => {
    // Exclude "Em andamento" and "Concluído" statuses
    if (demanda.status === "Em andamento" || demanda.status === "Concluído") {
      return false;
    }

    // Client-side search for protocol/subject since backend only filters by cat/status
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      demanda.protocolo?.toLowerCase().includes(term) ||
      demanda.assunto?.toLowerCase().includes(term) ||
      getSolicitante(demanda).toLowerCase().includes(term)
    );
  });

  // Define available options for filtering
  const availableStatusOptions = ["Aberto", "Encaminhada"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
          <FileText className="w-8 h-8 text-secondary" />
          Demandas
        </h1>
        <p className="text-muted-foreground">Gerencie todas as demandas dos cidadãos.</p>
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
              placeholder="Buscar..."
              className="input-corporate pl-10"
            />
          </div>

          <select
            value={filterCategoria}
            onChange={(e) => {
              setFilterCategoria(e.target.value);
              setCurrentPage(1);
            }}
            className="input-corporate"
          >
            <option value="">Todas as categorias</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="input-corporate"
          >
            <option value="">Todos os status</option>
            {availableStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearchTerm("");
              setFilterCategoria("");
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
                <th className="rounded-tl-lg w-[25%]">Protocolo</th>
                <th className="hidden lg:table-cell w-[25%]">Categoria</th>
                <th className="w-[25%]">Status</th>
                <th className="rounded-tr-lg text-right w-[25%]">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredDemandas.map((demanda) => (
                <tr key={demanda.id}>
                  <td>
                    <span className="font-medium text-secondary">{demanda.protocolo}</span>
                  </td>
                  <td className="hidden lg:table-cell text-muted-foreground">
                    <span className="font-medium text-foreground text-sm">
                      {demanda.categoria}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(demanda.status)}`}>
                      {demanda.status}
                    </span>
                  </td>
                  <td className="text-right">
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
            <p className="text-muted-foreground">Nenhuma demanda encontrada.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {
        totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )
      }

      {/* Forward Modal */}
      {
        forwardModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
            <div className="bg-card w-full max-w-md p-6 rounded-lg shadow-xl border border-border">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-foreground">Encaminhar Demanda</h2>
                <button onClick={() => setForwardModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Selecione o setor responsável para o protocolo <strong>{demandaToForward?.protocolo}</strong>.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="label-corporate">Setor de Destino</label>
                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="input-corporate"
                  >
                    <option value="">Selecione um setor...</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setForwardModalOpen(false)}
                    className="flex-1 btn-ghost"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleForwardSubmit}
                    disabled={!selectedSector}
                    className="flex-1 btn-primary"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default AdminDemandas;
