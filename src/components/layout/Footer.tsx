import { Link } from "react-router-dom";
import { Building2, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold">Cidadão 360</span>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Plataforma digital para atendimento ao cidadão com transparência, 
              participação e serviço eficiente.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/registrar-demanda" className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors">
                  Registrar Demanda
                </Link>
              </li>
              <li>
                <Link to="/consultar-protocolo" className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors">
                  Consultar Protocolo
                </Link>
              </li>
              <li>
                <Link to="/comunicados" className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors">
                  Comunicados
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors">
                  Sobre
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <Phone className="w-4 h-4" />
                <span>(00) 0000-0000</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <Mail className="w-4 h-4" />
                <span>contato@cidadao360.gov.br</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-primary-foreground/80">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Praça Central, 100 - Centro<br />Cidade - UF, 00000-000</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Redes Sociais</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Cidadão 360. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
