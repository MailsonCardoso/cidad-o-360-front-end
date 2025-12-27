import { useState, useEffect } from "react";
import { Star, TrendingUp, AlertCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import api from "../../services/api";
import { toast } from "sonner";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";

const Qualidade = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // We'll reuse the dashboard stats endpoint which now includes quality metrics
                const { data } = await api.get("/dashboard/stats");
                if (data.success) {
                    setStats(data.data);
                }
            } catch (error) {
                console.error(error);
                toast.error("Erro ao carregar dados de qualidade");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground">Carregando indicadores...</div>;
    }

    if (!stats) return null;

    // Prepare data for the chart
    const chartData = stats.satisfacao_por_setor?.map((item: any) => ({
        name: item.categoria,
        nota: parseFloat(item.media).toFixed(1),
        total: item.total
    })) || [];

    const mediaGeral = parseFloat(stats.media_satisfacao || 0).toFixed(1);

    // Determine color based on average rating
    const getRatingColor = (rating: number) => {
        if (rating >= 4.5) return "text-green-600";
        if (rating >= 3.5) return "text-blue-600";
        if (rating >= 2.5) return "text-yellow-600";
        return "text-red-600";
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">Relatório de Qualidade</h1>
                <p className="text-muted-foreground">Indicadores de satisfação do cidadão por setor</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-corporate flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                        <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Média Geral</p>
                        <h2 className={`text-3xl font-bold ${getRatingColor(Number(mediaGeral))}`}>
                            {mediaGeral}<span className="text-lg text-muted-foreground">/5.0</span>
                        </h2>
                    </div>
                </div>

                <div className="card-corporate flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <ThumbsUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Total de Avaliações</p>
                        <h2 className="text-3xl font-bold text-foreground">
                            {chartData.reduce((acc: number, curr: any) => acc + curr.total, 0)}
                        </h2>
                    </div>
                </div>

                <div className="card-corporate flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Melhor Setor</p>
                        <h2 className="text-xl font-bold text-foreground truncate max-w-[150px]" title={chartData[0]?.name || '-'}>
                            {chartData[0]?.name || '-'}
                        </h2>
                        <p className="text-xs text-green-600 font-medium">{chartData[0]?.nota || 0} ⭐</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ranking Chart */}
                <div className="card-corporate">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <BarChart className="w-5 h-5 text-secondary" />
                        Ranking de Satisfação por Setor
                    </h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" domain={[0, 5]} hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip
                                    formatter={(value: any) => [`${value} ⭐`, 'Nota Média']}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="nota" radius={[0, 4, 4, 0]} barSize={20}>
                                    {chartData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={Number(entry.nota) >= 4 ? '#22c55e' : Number(entry.nota) >= 3 ? '#3b82f6' : '#ef4444'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Detailed List (Mini Table of Detractors could go here, for now just general info) */}
                <div className="card-corporate">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-secondary" />
                        Atenção Necessária (Notas &lt; 3.0)
                    </h3>

                    <div className="space-y-4">
                        {chartData.filter((item: any) => Number(item.nota) < 3).length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <ThumbsUp className="w-12 h-12 mx-auto mb-2 text-green-200" />
                                <p>Nenhum setor com média crítica no momento.</p>
                            </div>
                        ) : (
                            chartData.filter((item: any) => Number(item.nota) < 3).map((item: any) => (
                                <div key={item.name} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-red-600 font-bold border border-red-100">
                                            !
                                        </div>
                                        <div>
                                            <p className="font-semibold text-red-900">{item.name}</p>
                                            <p className="text-xs text-red-700">{item.total} avaliações</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold text-red-600">{item.nota}</span>
                                        <span className="text-xs text-red-400 block">média</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Qualidade;
