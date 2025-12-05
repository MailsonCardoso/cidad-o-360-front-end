import { Info, Target, Eye, Users, Shield, Clock, HeadphonesIcon } from "lucide-react";

const Sobre = () => {
  const values = [
    {
      icon: Users,
      title: "Participação Cidadã",
      description: "Promovemos a participação ativa dos cidadãos nas decisões públicas.",
    },
    {
      icon: Shield,
      title: "Transparência",
      description: "Garantimos total transparência em todos os processos e informações.",
    },
    {
      icon: Clock,
      title: "Eficiência",
      description: "Buscamos a máxima eficiência no atendimento às demandas.",
    },
    {
      icon: HeadphonesIcon,
      title: "Atendimento Humanizado",
      description: "Tratamos cada cidadão com respeito e atenção individualizada.",
    },
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Info className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Sobre o Cidadão 360
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Conheça mais sobre nossa plataforma de atendimento digital ao cidadão.
          </p>
        </div>

        {/* About Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Introduction */}
          <section className="card-corporate">
            <h2 className="text-xl font-semibold text-foreground mb-4">O que é o Cidadão 360?</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              O Cidadão 360 é uma plataforma digital desenvolvida para facilitar a comunicação 
              entre os cidadãos e a administração pública municipal. Através desta ferramenta, 
              você pode registrar demandas, acompanhar solicitações, receber comunicados oficiais 
              e participar ativamente da gestão da cidade.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Nossa missão é transformar a relação entre governo e sociedade, tornando o 
              atendimento público mais eficiente, transparente e acessível a todos.
            </p>
          </section>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-corporate">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Nossa Missão</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Promover a participação cidadã e garantir um atendimento público de qualidade, 
                utilizando tecnologia para aproximar o governo da população e garantir 
                transparência em todas as ações.
              </p>
            </div>

            <div className="card-corporate">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Nossa Visão</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Ser referência em atendimento digital ao cidadão, criando uma cidade mais 
                participativa, transparente e conectada, onde cada voz é ouvida e cada 
                demanda é tratada com seriedade.
              </p>
            </div>
          </div>

          {/* Values */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
              Nossos Valores
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((value) => (
                <div key={value.title} className="card-corporate flex gap-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center shrink-0">
                    <value.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{value.title}</h4>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Services */}
          <section className="card-corporate">
            <h2 className="text-xl font-semibold text-foreground mb-4">Áreas de Atuação</h2>
            <p className="text-muted-foreground mb-4">
              O Cidadão 360 atende demandas em diversas áreas:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Segurança Pública",
                "Defesa do Consumidor",
                "Mobilidade Urbana",
                "Legislação Participativa",
                "Meio Ambiente",
                "Saúde",
                "Educação",
                "Infraestrutura",
              ].map((area) => (
                <li key={area} className="flex items-center gap-2 text-foreground">
                  <div className="w-2 h-2 bg-secondary rounded-full" />
                  {area}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Sobre;
