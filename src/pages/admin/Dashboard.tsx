import { Link } from "react-router-dom";
import { FileText, Clock, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import StatCard from "@/components/shared/StatCard";
import { mockDemandas, getStatusClass } from "@/data/mockData";

const AdminDashboard = () => {
  const stats = {
    abertas: mockDemandas.filter((d) => d.status === "Aberto").length,
    andamento: mockDemandas.filter((d) => d.status === "Em andamento").length,
    concluidas: mockDemandas.filter((d) => d.status === "Concluído").length,
  };

  const recentDemandas = mockDemandas.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo ao painel administrativo do Cidadão 360.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Demandas Abertas"
          value={stats.abertas}
          icon={AlertCircle}
          variant="warning"
          trend="Aguardando análise"
        />
        <StatCard
          title="Em Andamento"
          value={stats.andamento}
          icon={Clock}
          variant="secondary"
          trend="Em processamento"
        />
        <StatCard
          title="Concluídas"
          value={stats.concluidas}
          icon={CheckCircle}
          variant="success"
          trend="Este mês"
        />
      </div>

      {/* Recent Demands Table */}
      <div className="card-corporate">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-secondary" />
            Últimas Demandas
          </h2>
          <Link
            to="/admin/demandas"
            className="text-secondary text-sm font-medium hover:underline inline-flex items-center gap-1"
          >
            Ver todas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="table-corporate">
            <thead>
              <tr>
                <th className="rounded-tl-lg">Protocolo</th>
                <th>Nome</th>
                <th className="hidden md:table-cell">Categoria</th>
                <th>Status</th>
                <th className="rounded-tr-lg">Data</th>
              </tr>
            </thead>
            <tbody>
              {recentDemandas.map((demanda) => (
                <tr key={demanda.id}>
                  <td>
                    <Link
                      to={`/admin/demandas/${demanda.id}`}
                      className="text-secondary font-medium hover:underline"
                    >
                      {demanda.protocolo}
                    </Link>
                  </td>
                  <td className="text-foreground">{demanda.nome}</td>
                  <td className="hidden md:table-cell text-muted-foreground">
                    {demanda.categoria}
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(demanda.status)}`}>
                      {demanda.status}
                    </span>
                  </td>
                  <td className="text-muted-foreground">{demanda.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
