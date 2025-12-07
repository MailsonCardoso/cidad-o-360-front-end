import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Phone, Mail, FileText, Paperclip, Send, ArrowRight } from "lucide-react";
import Timeline from "@/components/shared/Timeline";
import Modal from "@/components/shared/Modal";
import api from "../../services/api";
import { toast } from "sonner";
import { statusOptions, getStatusClass, categories } from "@/data/mockData";

const AdminDemandaDetalhe = () => {
  const { id } = useParams();
  const [demanda, setDemanda] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const [status, setStatus] = useState("");
  const [resposta, setResposta] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [historico, setHistorico] = useState<any[]>([]);

  useEffect(() => {
    const fetchDemanda = async () => {
      try {
        const { data } = await api.get(`/demandas/${id}`);
        if (data.success) {
          setDemanda(data.data);
          setStatus(data.data.status);

          // Load history from backend
          if (data.data.historico && Array.isArray(data.data.historico)) {
            const formattedHistory = data.data.historico.map((h: any) => ({
              date: new Date(h.created_at).toLocaleDateString("pt-BR") + " - " +
                new Date(h.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
              status: h.status,
              description: h.descricao + (h.user ? ` (Por: ${h.user.name})` : ""),
            }));
            setHistorico(formattedHistory);
          } else {
            setHistorico([]);
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar demanda");
      } finally {
        setLoading(false);
      }
    };
    fetchDemanda();
  }, [id]);

  if (loading) return <div>Carregando...</div>;

  if (!demanda) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Demanda não encontrada
        </h1>
        <Link to="/admin/demandas" className="text-secondary hover:underline">
          Voltar para demandas
        </Link>
      </div>
    );
  }

  const handleStatusChange = async () => {
    try {
      const { data } = await api.put(`/demandas/${id}`, {
        status,
        descricao: demanda.descricao,
        observacao: resposta // Send the observation/response
      });

      if (data.success) {
        toast.success("Status atualizado com sucesso!");
        setResposta("");
        setIsModalOpen(true);

        // Refetch the demand to get updated history from backend
        const { data: updatedData } = await api.get(`/demandas/${id}`);
        if (updatedData.success) {
          setDemanda(updatedData.data);
          setStatus(updatedData.data.status);

          // Update history from backend
          if (updatedData.data.historico && Array.isArray(updatedData.data.historico)) {
            const formattedHistory = updatedData.data.historico.map((h: any) => ({
              date: new Date(h.created_at).toLocaleDateString("pt-BR") + " - " +
                new Date(h.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
              status: h.status,
              description: h.descricao + (h.user ? ` (Por: ${h.user.name})` : ""),
            }));
            setHistorico(formattedHistory);
          }
        }

        // Navigate to appropriate screen based on user role
        setTimeout(() => {
          if (user.role === 'admin') {
            navigate("/admin/dashboard");
          } else if (user.role === 'atendimento') {
            navigate("/admin/demandas");
          } else if (user.setor) {
            // Sector user - navigate to their sector page
            navigate(`/admin/setor/${encodeURIComponent(user.setor)}`);
          } else {
            // Fallback to demandas
            navigate("/admin/demandas");
          }
        }, 1500);
      }
    } catch (error) {
      toast.error("Erro ao atualizar status");
    }
  };

  // Helper to extract info
  const getField = (field: string) => {
    if (demanda.user) return demanda.user[field];

    const labelMap: Record<string, string> = {
      'name': 'Solicitante',
      'CPF': 'CPF',
      'Telefone': 'Tel',
      'Email': 'Email'
    };

    const label = labelMap[field] || field;
    // Regex explanation:
    // 1. Matches the label (e.g., "Solicitante")
    // 2. Matches optional spaces and a colon and optional spaces: \s*:\s*
    // 3. Captures content until end of line or string: (.*?)
    // 4. Handles Windows/Unix line endings: (?:\n|\r|$)
    const regex = new RegExp(`${label}\\s*:\\s*(.*?)(?:\\n|\\r|$)`, 'i');
    const match = demanda.descricao?.match(regex);
    return match ? match[1].trim() : "N/I";
  };

  const nome = demanda.user ? demanda.user.name : getField('name');
  const cpf = getField('CPF');
  const telefone = getField('Telefone');
  const email = demanda.user ? demanda.user.email : getField('Email');
  const anexos = demanda.arquivo ? [demanda.arquivo] : [];

  // Clean description for display (remove the appended metadata)
  const displayDescription = demanda.descricao?.split("--- DADOS DE CONTATO DO SOLICITANTE ---")[0].trim();

  // Determine back URL based on user role
  const getBackUrl = () => {
    if (user.role === 'admin') {
      return "/admin/dashboard";
    } else if (user.role === 'atendimento') {
      return "/admin/demandas";
    } else if (user.setor) {
      return `/admin/setor/${encodeURIComponent(user.setor)}`;
    }
    return "/admin/demandas";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to={getBackUrl()}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              {demanda.protocolo}
            </h1>
            <p className="text-sm text-muted-foreground">Detalhes da solicitação</p>
          </div>
        </div>
        <span className={`status-badge ${getStatusClass(demanda.status)} px-4 py-1.5 text-sm`}>
          {demanda.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Demand Info */}
          <div className="card-corporate">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2 pb-2 border-b border-border">
              <FileText className="w-5 h-5 text-secondary" />
              Dados da Demanda
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assunto</p>
                <p className="text-lg text-foreground font-medium">{demanda.assunto}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Setor Responsável</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {demanda.categoria}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data de Abertura</p>
                  <p className="text-foreground mt-1">{new Date(demanda.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Descrição Detalhada</p>
                <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm">
                    {displayDescription}
                  </p>
                </div>
              </div>
            </div>

            {anexos.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Paperclip className="w-4 h-4" />
                  Arquivos Anexados
                </p>
                <div className="flex flex-wrap gap-2">
                  {anexos.map((anexo: string, index: number) => (
                    <a
                      key={index}
                      href={`http://127.0.0.1:8000/storage/${anexo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground hover:border-secondary hover:text-secondary transition-all shadow-sm"
                    >
                      <FileText className="w-4 h-4" />
                      Visualizar Anexo {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Timeline History */}
          <div className="card-corporate">
            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2 pb-2 border-b border-border">
              <FileText className="w-5 h-5 text-secondary" />
              Histórico de Tramitação
            </h2>
            <Timeline items={historico} />
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-6">

          {/* Solicitante Card */}
          <div className="card-corporate bg-muted/30">
            <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Solicitante
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold text-xs">
                    {nome.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{nome}</p>
                  <p className="text-xs text-muted-foreground">Cidadão</p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-0.5">
                    <FileText className="w-3 h-3" /> CPF
                  </p>
                  <p className="text-sm font-medium">{cpf}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-0.5">
                    <Phone className="w-3 h-3" /> Telefone
                  </p>
                  <p className="text-sm font-medium">{telefone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-0.5">
                    <Mail className="w-3 h-3" /> E-mail
                  </p>
                  <p className="text-sm font-medium break-all">{email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Card - Conditional based on Role */}
          {demanda.status === "Concluído" && user.role !== 'admin' ? (
            /* Locked for non-admin users */
            <div className="card-corporate border-warning/20 shadow-md bg-warning/5">
              <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                <Send className="w-4 h-4 text-warning" />
                Demanda Concluída
              </h2>
              <p className="text-sm text-muted-foreground">
                Esta demanda foi concluída. Apenas administradores podem alterar o status de demandas concluídas.
              </p>
            </div>
          ) : user.role === 'atendimento' ? (
            /* Dispatcher View - Forward Only */
            <div className="card-corporate border-secondary/20 shadow-md">
              <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-secondary" />
                Encaminhar Demanda
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Selecione o Setor de Destino</label>
                  <div className="relative">
                    <select
                      className="w-full p-2.5 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                      onChange={(e) => setStatus(`Encaminhada para ${e.target.value}`)}
                      defaultValue=""
                      disabled={demanda.status === "Concluído" && user.role !== 'admin'}
                    >
                      <option value="" disabled>Escolha o setor...</option>
                      {categories ? (
                        categories.map(cat => <option key={cat} value={cat}>{cat}</option>)
                      ) : (
                        <>
                          <option value="Saúde">Saúde</option>
                          <option value="Educação">Educação</option>
                          <option value="Infraestrutura">Infraestrutura</option>
                          <option value="Segurança">Segurança</option>
                          <option value="Transporte">Transporte</option>
                          <option value="Meio Ambiente">Meio Ambiente</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Justificativa do Encaminhamento</label>
                  <textarea
                    value={resposta}
                    onChange={(e) => setResposta(e.target.value)}
                    rows={4}
                    className="w-full p-3 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all resize-none"
                    placeholder="Escreva o motivo do encaminhamento..."
                    disabled={demanda.status === "Concluído" && user.role !== 'admin'}
                  />
                </div>

                <button
                  onClick={handleStatusChange}
                  disabled={!status.startsWith("Encaminhada") || (demanda.status === "Concluído" && user.role !== 'admin')}
                  className="w-full btn-primary flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  Confirmar Encaminhamento
                </button>
              </div>
            </div>
          ) : (
            /* Admin/Other View - Full Status Control */
            <div className="card-corporate border-secondary/20 shadow-md">
              <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                <Send className="w-4 h-4 text-secondary" />
                Atualizar Status
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Alterar Status Para</label>
                  <div className="relative">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full p-2.5 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                      disabled={demanda.status === "Concluído" && user.role !== 'admin'}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Observação Interna / Resposta</label>
                  <textarea
                    value={resposta}
                    onChange={(e) => setResposta(e.target.value)}
                    rows={4}
                    className="w-full p-3 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all resize-none"
                    placeholder="Escreva detalhes sobre a atualização..."
                    disabled={demanda.status === "Concluído" && user.role !== 'admin'}
                  />
                </div>

                <button
                  onClick={handleStatusChange}
                  disabled={demanda.status === "Concluído" && user.role !== 'admin'}
                  className="w-full btn-primary flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  Salvar Atualização
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Status Atualizado"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6 text-success" />
          </div>
          <p className="text-foreground mb-1 font-medium">Sucesso!</p>
          <p className="text-muted-foreground text-sm mb-4">
            Demanda atualizada para <strong>{status}</strong>.
          </p>
          <button onClick={() => setIsModalOpen(false)} className="btn-primary w-full">
            Fechar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDemandaDetalhe;
