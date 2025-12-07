import { X } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="bg-card w-full max-w-lg rounded-xl shadow-2xl border border-border flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-5 border-b border-border bg-muted/30 rounded-t-xl">
          <h2 className="text-lg font-semibold text-foreground tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1.5 hover:bg-muted rounded-full transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
