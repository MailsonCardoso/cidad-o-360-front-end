import { useState } from "react";
import { Search, FileText, AlertCircle } from "lucide-react";
import Timeline from "@/components/shared/Timeline";
import { getStatusClass } from "@/data/mockData";
import api from "../services/api";
import { toast } from "sonner";

const ConsultarProtocolo = () => {
  const [protocolo, setProtocolo] = useState("");
  const [cpf, setCpf] = useState("");
  const [demanda, setDemanda] = useState<any | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [searched, setSearched] = useState(false);

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    setNotFound(false);
    setDemanda(null);

    try {
      const { data } = await api.get(`/consultar/${protocolo}`);
      if (data.success && data.data) {
        // Client-side verification of CPF
        const description = data.data.descricao || "";
        const cpfClean = cpf.replace(/\D/g, "");
        const descriptionClean = description.replace(/\D/g, "");

        // Check if the formatted CPF string is present in the description
        if (descriptionClean.includes(cpfClean)) {
          setDemanda(data.data);
        } else {
          setNotFound(true);
        }
      } else {
        setNotFound(true);
      }
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 404) {
        setNotFound(true);
      } else {
        toast.error("Erro ao consultar protocolo. Tente novamente.");
      }
    }
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-secondary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Consultar Protocolo
            </h1>
            <p className="text-muted-foreground">
              Acompanhe o andamento da sua demanda informando o número do protocolo e CPF.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="card-corporate mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="protocolo" className="label-corporate">
                  Número do Protocolo *
                </label>
                <input
                  type="text"
                  id="protocolo"
                  value={protocolo}
                  onChange={(e) => setProtocolo(e.target.value.toUpperCase())}
                  required
                  className="input-corporate"
                  placeholder="C360-20240101-ABCD"
                />
              </div>
              <div>
                <label htmlFor="cpf" className="label-corporate">
                  CPF *
                </label>
                <input
                  type="text"
                  id="cpf"
                  value={cpf}
                  onChange={(e) => setCpf(formatCPF(e.target.value))}
                  required
                  maxLength={14}
                  className="input-corporate"
                  placeholder="000.000.000-00"
                />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full">
              <Search className="w-5 h-5 inline mr-2" />
              Consultar
            </button>
          </form>

          {/* Result */}
          {searched && notFound && (
            <div className="card-corporate text-center animate-fade-in">
              <AlertCircle className="w-12 h-12 text-warning mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Protocolo não encontrado
              </h3>
              <p className="text-muted-foreground text-sm">
                Verifique se o número do protocolo e CPF estão corretos e tente novamente.
              </p>
            </div>
          )}

          {demanda && (
            <div className="space-y-6 animate-fade-in">
              {/* Status Card */}
              <div className="card-corporate">
                <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Protocolo</p>
                    <p className="text-xl font-bold text-secondary">{demanda.protocolo}</p>
                  </div>
                  <span className={`status-badge ${getStatusClass(demanda.status)}`}>
                    {demanda.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Setor</p>
                    <p className="text-foreground font-medium">{demanda.categoria}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Data de Abertura</p>
                    <p className="text-foreground font-medium">{new Date(demanda.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground mb-1">Assunto</p>
                    <p className="text-foreground font-medium">{demanda.assunto}</p>
                  </div>

                </div>
              </div>

              {/* Timeline */}
              {demanda.historico && demanda.historico.length > 0 && (
                <div className="card-corporate">
                  <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-secondary" />
                    Histórico
                  </h3>
                  <Timeline items={demanda.historico.map((h: any) => ({
                    date: new Date(h.created_at).toLocaleString(),
                    status: h.status,
                    description: h.descricao.replace(/ por .*$/i, '')
                  }))} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultarProtocolo;
