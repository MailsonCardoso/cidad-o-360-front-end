import { useState } from "react";
import { Megaphone, Plus, Edit, Trash2, X, Upload } from "lucide-react";
import Modal from "@/components/shared/Modal";
import { mockComunicados } from "@/data/mockData";

interface Comunicado {
  id: string;
  titulo: string;
  data: string;
  resumo: string;
  conteudo: string;
}

const AdminComunicados = () => {
  const [comunicados, setComunicados] = useState<Comunicado[]>(mockComunicados);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    titulo: "",
    resumo: "",
    conteudo: "",
    data: new Date().toLocaleDateString("pt-BR"),
  });

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({
      titulo: "",
      resumo: "",
      conteudo: "",
      data: new Date().toLocaleDateString("pt-BR"),
    });
    setIsModalOpen(true);
  };

  const handleEdit = (comunicado: Comunicado) => {
    setEditingId(comunicado.id);
    setFormData({
      titulo: comunicado.titulo,
      resumo: comunicado.resumo,
      conteudo: comunicado.conteudo,
      data: comunicado.data,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setComunicados(comunicados.filter((c) => c.id !== deletingId));
      setIsDeleteModalOpen(false);
      setDeletingId(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      setComunicados(
        comunicados.map((c) =>
          c.id === editingId ? { ...c, ...formData } : c
        )
      );
    } else {
      const newComunicado: Comunicado = {
        id: String(Date.now()),
        ...formData,
      };
      setComunicados([newComunicado, ...comunicados]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <Megaphone className="w-8 h-8 text-secondary" />
            Comunicados
          </h1>
          <p className="text-muted-foreground">Gerencie os comunicados oficiais.</p>
        </div>

        <button onClick={handleOpenNew} className="btn-primary">
          <Plus className="w-5 h-5 inline mr-2" />
          Novo Comunicado
        </button>
      </div>

      {/* List */}
      <div className="grid gap-4">
        {comunicados.map((comunicado) => (
          <div key={comunicado.id} className="card-corporate">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                  <span>{comunicado.data}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {comunicado.titulo}
                </h3>
                <p className="text-muted-foreground text-sm">{comunicado.resumo}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(comunicado)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-secondary"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(comunicado.id)}
                  className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {comunicados.length === 0 && (
        <div className="card-corporate text-center py-12">
          <p className="text-muted-foreground">Nenhum comunicado cadastrado.</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Editar Comunicado" : "Novo Comunicado"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-corporate">Título *</label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, titulo: e.target.value }))
              }
              required
              className="input-corporate"
              placeholder="Título do comunicado"
            />
          </div>

          <div>
            <label className="label-corporate">Resumo *</label>
            <input
              type="text"
              value={formData.resumo}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, resumo: e.target.value }))
              }
              required
              className="input-corporate"
              placeholder="Breve resumo do comunicado"
            />
          </div>

          <div>
            <label className="label-corporate">Conteúdo *</label>
            <textarea
              value={formData.conteudo}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, conteudo: e.target.value }))
              }
              required
              rows={6}
              className="input-corporate resize-none"
              placeholder="Conteúdo completo do comunicado (suporta HTML)..."
            />
          </div>

          <div>
            <label className="label-corporate">Anexo (opcional)</label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-secondary/50 transition-colors">
              <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Clique para anexar arquivo
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-outline flex-1"
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary flex-1">
              {editingId ? "Salvar" : "Criar"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Exclusão"
      >
        <div className="text-center">
          <p className="text-muted-foreground mb-6">
            Tem certeza que deseja excluir este comunicado? Esta ação não pode ser desfeita.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="btn-outline flex-1"
            >
              Cancelar
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 bg-destructive text-destructive-foreground px-6 py-3 rounded-lg font-medium hover:bg-destructive/90 transition-colors"
            >
              Excluir
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminComunicados;
