import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Filter, Search, Eye } from "lucide-react";
import Pagination from "@/components/shared/Pagination";
import { mockDemandas, categories, statusOptions, getStatusClass } from "@/data/mockData";

const AdminDemandas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredDemandas = mockDemandas.filter((demanda) => {
    const matchSearch =
      demanda.protocolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demanda.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demanda.assunto.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = !filterCategoria || demanda.categoria === filterCategoria;
    const matchStatus = !filterStatus || demanda.status === filterStatus;
    return matchSearch && matchCategoria && matchStatus;
  });

  const totalPages = Math.ceil(filteredDemandas.length / itemsPerPage);
  const paginatedDemandas = filteredDemandas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
            {statusOptions.map((status) => (
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
                <th className="rounded-tl-lg">Protocolo</th>
                <th>Nome</th>
                <th className="hidden lg:table-cell">Categoria</th>
                <th>Status</th>
                <th className="hidden md:table-cell">Data</th>
                <th className="rounded-tr-lg">Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDemandas.map((demanda) => (
                <tr key={demanda.id}>
                  <td>
                    <span className="font-medium text-secondary">{demanda.protocolo}</span>
                  </td>
                  <td>
                    <div>
                      <p className="text-foreground font-medium">{demanda.nome}</p>
                      <p className="text-muted-foreground text-sm truncate max-w-[200px]">
                        {demanda.assunto}
                      </p>
                    </div>
                  </td>
                  <td className="hidden lg:table-cell text-muted-foreground">
                    {demanda.categoria}
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(demanda.status)}`}>
                      {demanda.status}
                    </span>
                  </td>
                  <td className="hidden md:table-cell text-muted-foreground">
                    {demanda.data}
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

        {filteredDemandas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma demanda encontrada.</p>
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

export default AdminDemandas;
