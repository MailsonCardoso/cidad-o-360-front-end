import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User, Phone, Mail, FileText, Paperclip, Send } from "lucide-react";
import Timeline from "@/components/shared/Timeline";
import Modal from "@/components/shared/Modal";
import { mockDemandas, statusOptions, getStatusClass } from "@/data/mockData";

const AdminDemandaDetalhe = () => {
  const { id } = useParams();
  const demanda = mockDemandas.find((d) => d.id === id);

  const [status, setStatus] = useState(demanda?.status || "");
  const [resposta, setResposta] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [historico, setHistorico] = useState(demanda?.historico || []);

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

  const handleStatusChange = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("pt-BR") + " - " + now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    
    setHistorico([
      ...historico,
      {
        date: dateStr,
        status: `Status alterado para: ${status}`,
        description: resposta || "Status atualizado pelo administrador.",
      },
    ]);
    setResposta("");
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap">
        <Link
          to="/admin/demandas"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{demanda.protocolo}</h1>
          <p className="text-muted-foreground">{demanda.assunto}</p>
        </div>
        <span className={`status-badge ${getStatusClass(demanda.status)}`}>
          {demanda.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Demand Details */}
          <div className="card-corporate">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-secondary" />
              Detalhes da Demanda
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Categoria</p>
                <p className="text-foreground font-medium">{demanda.categoria}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Data de Abertura</p>
                <p className="text-foreground font-medium">{demanda.data}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Descrição</p>
              <p className="text-foreground leading-relaxed">{demanda.descricao}</p>
            </div>

            {demanda.anexos.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                  <Paperclip className="w-4 h-4" />
                  Anexos
                </p>
                <div className="flex flex-wrap gap-2">
                  {demanda.anexos.map((anexo, index) => (
                    <a
                      key={index}
                      href="#"
                      className="inline-flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm text-foreground hover:bg-muted/80 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-secondary" />
                      {anexo}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="card-corporate">
            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-secondary" />
              Histórico
            </h2>
            <Timeline items={historico} />
          </div>

          {/* Response Area */}
          <div className="card-corporate">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Atualizar Demanda
            </h2>

            <div className="space-y-4">
              <div>
                <label className="label-corporate">Novo Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="input-corporate"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label-corporate">Resposta / Observação</label>
                <textarea
                  value={resposta}
                  onChange={(e) => setResposta(e.target.value)}
                  rows={4}
                  className="input-corporate resize-none"
                  placeholder="Digite uma mensagem ou observação..."
                />
              </div>

              <button onClick={handleStatusChange} className="btn-primary">
                <Send className="w-4 h-4 inline mr-2" />
                Atualizar Status
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Citizen Info */}
          <div className="card-corporate">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-secondary" />
              Dados do Cidadão
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Nome</p>
                <p className="text-foreground font-medium">{demanda.nome}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">CPF</p>
                <p className="text-foreground">{demanda.cpf}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <p className="text-foreground">{demanda.telefone}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <p className="text-foreground text-sm break-all">{demanda.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Status Atualizado"
      >
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            O status da demanda foi atualizado com sucesso para <strong>{status}</strong>.
          </p>
          <button onClick={() => setIsModalOpen(false)} className="btn-primary">
            Entendido
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDemandaDetalhe;
