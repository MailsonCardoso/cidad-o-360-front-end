import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";

interface CommunicationCardProps {
  id: string;
  title: string;
  date: string;
  summary: string;
}

const CommunicationCard = ({ id, title, date, summary }: CommunicationCardProps) => {
  return (
    <Link to={`/comunicados/${id}`} className="card-corporate group block">
      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
        <Calendar className="w-4 h-4" />
        <span>{date}</span>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-secondary transition-colors">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-4">{summary}</p>
      <span className="inline-flex items-center gap-1 text-secondary text-sm font-medium group-hover:gap-2 transition-all">
        Ler mais <ArrowRight className="w-4 h-4" />
      </span>
    </Link>
  );
};

export default CommunicationCard;
