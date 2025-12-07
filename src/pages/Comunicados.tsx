import { useState, useEffect } from "react";
import { Megaphone } from "lucide-react";
import CommunicationCard from "@/components/shared/CommunicationCard";
import api from "../services/api";

interface Comunicado {
  id: number;
  titulo: string;
  data_publicacao: string;
  resumo: string;
}

const Comunicados = () => {
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComunicados = async () => {
      try {
        const response = await api.get("/comunicados");
        if (response.data.success && response.data.data.data) {
          setComunicados(response.data.data.data);
        } else {
          setComunicados([]);
        }
      } catch (error) {
        console.error("Erro ao carregar comunicados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComunicados();
  }, []);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Megaphone className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Comunicados
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Fique por dentro das últimas notícias e comunicados oficiais da administração municipal.
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Carregando comunicados...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {comunicados.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Nenhum comunicado disponível no momento.
              </div>
            ) : (
              comunicados.map((comunicado) => (
                <CommunicationCard
                  key={comunicado.id}
                  id={String(comunicado.id)}
                  title={comunicado.titulo}
                  date={new Date(comunicado.data_publicacao).toLocaleDateString('pt-BR')}
                  summary={comunicado.resumo}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comunicados;
