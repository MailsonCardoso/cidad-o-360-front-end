import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

const ServiceCard = ({ title, description, icon: Icon, href }: ServiceCardProps) => {
  return (
    <Link to={href} className="card-service group">
      <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
        <Icon className="w-7 h-7 text-secondary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </Link>
  );
};

export default ServiceCard;
