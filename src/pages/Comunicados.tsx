import { Megaphone } from "lucide-react";
import CommunicationCard from "@/components/shared/CommunicationCard";
import { mockComunicados } from "@/data/mockData";

const Comunicados = () => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {mockComunicados.map((comunicado) => (
            <CommunicationCard
              key={comunicado.id}
              id={comunicado.id}
              title={comunicado.titulo}
              date={comunicado.data}
              summary={comunicado.resumo}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Comunicados;
