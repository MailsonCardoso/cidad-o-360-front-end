import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import api from "../services/api";

interface Comunicado {
  id: number;
  titulo: string;
  data_publicacao: string;
  resumo: string;
  conteudo: string;
}

const ComunicadoDetalhe = () => {
  const { id } = useParams();
  const [comunicado, setComunicado] = useState<Comunicado | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchComunicado = async () => {
      try {
        const response = await api.get(`/comunicados/${id}`);
        if (response.data.success) {
          setComunicado(response.data.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Erro ao carregar comunicado:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchComunicado();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando comunicado...</p>
        </div>
      </div>
    );
  }

  if (error || !comunicado) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Comunicado não encontrado
          </h1>
          <Link to="/comunicados" className="text-secondary hover:underline">
            Voltar para comunicados
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <Link
            to="/comunicados"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para comunicados
          </Link>

          {/* Content */}
          <article className="card-corporate">
            <header className="mb-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                <Calendar className="w-4 h-4" />
                <span>{new Date(comunicado.data_publicacao).toLocaleDateString('pt-BR')}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {comunicado.titulo}
              </h1>
            </header>

            <div
              className="prose prose-sm max-w-none text-foreground"
              dangerouslySetInnerHTML={{ __html: comunicado.conteudo }}
            />

            {/* Share */}
            <footer className="mt-8 pt-6 border-t border-border flex items-center justify-between flex-wrap gap-4">
              <Link
                to="/comunicados"
                className="btn-outline text-sm px-4 py-2"
              >
                <ArrowLeft className="w-4 h-4 inline mr-2" />
                Voltar
              </Link>
              <button className="inline-flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors">
                <Share2 className="w-4 h-4" />
                Compartilhar
              </button>
            </footer>
          </article>
        </div>
      </div>
    </div>
  );
};

export default ComunicadoDetalhe;
