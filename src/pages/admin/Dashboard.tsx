import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Clock, CheckCircle, AlertCircle, ArrowRight, TrendingUp, BarChart as BarChartIcon } from "lucide-react";
import StatCard from "@/components/shared/StatCard";
import { getStatusClass } from "@/data/mockData";
import api from "../../services/api";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    abertas: 0,
    andamento: 0,
    concluidas: 0,
    concluidas_mes: 0,
    recentes: [] as any[],
    categorias: [] as any[],
    status_detalhado: [] as any[],
    ranking_setores: [] as any[],
    tendencias: [] as any[],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];
  const STATUS_COLORS = {
    Aberto: "#F59E0B", // Warning/Yellow
    "Em andamento": "#3B82F6", // Blue
    Concluído: "#10B981", // Green
  };

  useEffect(() => {
    // Permission Check
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== 'admin') {
      toast.error("Acesso não autorizado.");
      navigate("/admin/demandas"); // Redirect unauthorized users
      return;
    }

    const fetchStats = async () => {
      try {
        const { data } = await api.get("/dashboard/stats");
        if (data.success) {
          setStats({
            abertas: data.data.abertas,
            andamento: data.data.andamento,
            concluidas: data.data.concluidas,
            concluidas_mes: data.data.concluidas_mes || 0,
            recentes: data.data.recentes,
            categorias: data.data.categorias || [],
            status_detalhado: data.data.status_detalhado || [],
            ranking_setores: data.data.ranking_setores || [],
            tendencias: data.data.tendencias || [],
          });
        }
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Carregando dashboard...</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo ao painel administrativo do Cidadão 360.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
          title="Total Concluídas"
          value={stats.concluidas}
          icon={CheckCircle}
          variant="success"
          trend="Histórico completo"
        />
        <StatCard
          title="Concluídas no Mês"
          value={stats.concluidas_mes}
          icon={TrendingUp}
          variant="primary"
          trend="Neste mês"
        />
      </div>

      {/* Charts Section Top */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trends Chart (Wide) */}
        <div className="card-corporate lg:col-span-2 h-[400px]">
          <h2 className="text-lg font-semibold text-foreground mb-6">Tendência de Atendimentos (12 Meses)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={stats.tendencias}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="abertas" name="Novas Demandas" stroke="#F59E0B" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="concluidas" name="Concluídas" stroke="#10B981" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Ranking */}
        <div className="card-corporate h-[400px] flex flex-col">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChartIcon className="w-5 h-5 text-secondary" />
            Ranking de Setores
          </h2>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {stats.ranking_setores.map((setor: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${index < 3 ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {index + 1}
                  </span>
                  <span className="font-medium text-sm">{setor.categoria}</span>
                </div>
                <span className="text-sm font-bold text-foreground">{setor.total}</span>
              </div>
            ))}
            {stats.ranking_setores.length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-4">Sem dados</p>
            )}
          </div>
        </div>
      </div>

      {/* Charts Section Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories Chart */}
        <div className="card-corporate h-[400px]">
          <h2 className="text-lg font-semibold text-foreground mb-6">Demandas por Setor (Total)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.categorias}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="categoria" hide />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" name="Quantidade" fill="#2563EB">
                  {stats.categorias.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Chart */}
        <div className="card-corporate h-[400px]">
          <h2 className="text-lg font-semibold text-foreground mb-6">Demandas por Status</h2>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.status_detalhado}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total"
                  nameKey="status"
                >
                  {stats.status_detalhado.map((entry, index) => (
                    // @ts-ignore
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
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
                <th className="hidden md:table-cell">Setor</th>
                <th>Status</th>
                <th className="rounded-tr-lg">Data</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-muted-foreground">Nenhuma demanda recente.</td>
                </tr>
              ) : (
                stats.recentes.map((demanda) => (
                  <tr key={demanda.id}>
                    <td>
                      <Link
                        to={`/admin/demandas/${demanda.id}`}
                        className="text-secondary font-medium hover:underline"
                      >
                        {demanda.protocolo}
                      </Link>
                    </td>
                    <td className="text-foreground">
                      {/* Identify guest or use name if logged in (not implemented in model yet but logic exists) */}
                      {demanda.user_id ? "Usuário Cadastrado" : "Visitante"}
                    </td>
                    <td className="hidden md:table-cell text-muted-foreground">
                      {demanda.categoria}
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(demanda.status)}`}>
                        {demanda.status}
                      </span>
                    </td>
                    <td className="text-muted-foreground">{new Date(demanda.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
