interface TimelineItem {
  date: string;
  status: string;
  description: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

const Timeline = ({ items }: TimelineProps) => {
  return (
    <div className="space-y-0">
      {items.map((item, index) => (
        <div key={index} className="timeline-item">
          <div className="timeline-dot" />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-foreground">{item.status}</span>
              <span className="text-xs text-muted-foreground">{item.date}</span>
            </div>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
