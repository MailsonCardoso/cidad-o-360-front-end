import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import { mockComunicados } from "@/data/mockData";

const ComunicadoDetalhe = () => {
  const { id } = useParams();
  const comunicado = mockComunicados.find((c) => c.id === id);

  if (!comunicado) {
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
                <span>{comunicado.data}</span>
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
