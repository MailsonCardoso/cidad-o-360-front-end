import { FileText, Search, Megaphone, Info, ArrowRight, Shield, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import ServiceCard from "@/components/shared/ServiceCard";

const Index = () => {
  const services = [
    {
      title: "Registrar Demanda",
      description: "Envie solicitações, reclamações ou sugestões para os órgãos responsáveis.",
      icon: FileText,
      href: "/registrar-demanda",
    },
    {
      title: "Consultar Protocolo",
      description: "Acompanhe o andamento da sua demanda através do número de protocolo.",
      icon: Search,
      href: "/consultar-protocolo",
    },
    {
      title: "Comunicados",
      description: "Fique por dentro das notícias e comunicados oficiais da administração.",
      icon: Megaphone,
      href: "/comunicados",
    },
    {
      title: "Sobre",
      description: "Conheça mais sobre o Portal Cidadão 360 e seus serviços.",
      icon: Info,
      href: "/sobre",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Segurança",
      description: "Seus dados protegidos com as melhores práticas de segurança.",
    },
    {
      icon: Users,
      title: "Participação",
      description: "Participe ativamente das decisões da sua cidade.",
    },
    {
      icon: Clock,
      title: "Agilidade",
      description: "Respostas rápidas e acompanhamento em tempo real.",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient text-primary-foreground py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Atendimento Digital ao Cidadão
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
              Transparência, participação e serviço eficiente. 
              O Cidadão 360 conecta você diretamente com a administração pública.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/registrar-demanda"
                className="inline-flex items-center justify-center gap-2 bg-primary-foreground text-primary px-8 py-4 rounded-lg font-semibold hover:bg-primary-foreground/90 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Registrar Demanda
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/consultar-protocolo"
                className="inline-flex items-center justify-center gap-2 border-2 border-primary-foreground/30 text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary-foreground/10 transition-all duration-200"
              >
                Consultar Protocolo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Nossos Serviços
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Acesse os principais serviços do Portal Cidadão 360 e resolva suas demandas de forma rápida e eficiente.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.href} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Por que usar o Cidadão 360?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Uma plataforma moderna que facilita a comunicação entre cidadãos e administração pública.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-2xl p-8 lg:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              Precisa de Ajuda?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Nossa equipe está pronta para atender você. Entre em contato pelo WhatsApp ou registre sua demanda online.
            </p>
            <Link
              to="/registrar-demanda"
              className="inline-flex items-center justify-center gap-2 bg-primary-foreground text-primary px-8 py-4 rounded-lg font-semibold hover:bg-primary-foreground/90 transition-all duration-200"
            >
              Fale Conosco
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
