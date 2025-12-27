import { useState } from "react";
import { Search, FileText, AlertCircle, Printer, Star } from "lucide-react";
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
      // Send CPF to backend for verification
      const cpfClean = cpf.replace(/\D/g, "");
      const { data } = await api.get(`/consultar/${protocolo}?cpf=${cpfClean}`);

      if (data.success && data.data) {
        setDemanda(data.data);
      } else {
        setNotFound(true);
      }
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 403) {
        toast.error("CPF incorreto para este protocolo.");
      } else if (error.response?.status === 404) {
        setNotFound(true);
      } else {
        toast.error("Erro ao consultar protocolo. Tente novamente.");
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Satisfaction Survey Logic
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingRate, setSubmittingRate] = useState(false);

  const submitRating = async () => {
    if (!demanda || rating === 0) return;
    setSubmittingRate(true);
    try {
      await api.post(`/demandas/${demanda.id}/rate`, {
        nota: rating,
        comentario: comment
      });
      toast.success("Obrigado pela sua avaliação!");
      // Update local state to hide form
      setDemanda(prev => ({ ...prev, satisfacao_nota: rating }));
    } catch (error) {
      toast.error("Erro ao enviar avaliação.");
    } finally {
      setSubmittingRate(false);
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

                <div className="mb-6 flex justify-end print:hidden">
                  <button onClick={handlePrint} className="btn-outline flex items-center gap-2 text-sm">
                    <Printer className="w-4 h-4" />
                    Imprimir Comprovante
                  </button>
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

              {/* Satisfaction Survey Section */}
              {demanda.status === 'Concluído' && !demanda.satisfacao_nota && (
                <div className="card-corporate animate-fade-in print:hidden">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Pesquisa de Satisfação
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sua demanda foi concluída. Como você avalia nosso atendimento?
                  </p>

                  <div className="flex gap-2 mb-4 justify-center md:justify-start">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="transition-all hover:scale-110 focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${rating >= star ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                        />
                      </button>
                    ))}
                  </div>

                  {rating > 0 && (
                    <div className="space-y-4 animate-fade-in">
                      <textarea
                        className="input-corporate w-full resize-none"
                        rows={3}
                        placeholder="Deixe um comentário (opcional)..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <button
                        onClick={submitRating}
                        disabled={submittingRate}
                        className="btn-primary w-full md:w-auto"
                      >
                        {submittingRate ? "Enviando..." : "Enviar Avaliação"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Thank you message if already rated */}
              {demanda.satisfacao_nota && (
                <div className="card-corporate bg-green-50 border-green-200 no-print">
                  <div className="text-center text-green-800">
                    <p className="font-medium">Obrigado pela sua avaliação!</p>
                    <div className="flex justify-center gap-1 mt-2">
                      {[...Array(demanda.satisfacao_nota)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-green-600 text-green-600" />
                      ))}
                    </div>
                  </div>
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
