import { useState, useEffect } from "react";
import { Megaphone, Plus, Edit, Trash2, Upload } from "lucide-react";
import Modal from "@/components/shared/Modal";
import api from "../../services/api";
import { toast } from "sonner";

interface Comunicado {
  id: number;
  titulo: string;
  data_publicacao: string;
  resumo: string;
  conteudo: string;
}

const AdminComunicados = () => {
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    titulo: "",
    resumo: "",
    conteudo: "",
    data_publicacao: new Date().toISOString().split('T')[0],
  });

  const fetchComunicados = async () => {
    try {
      setLoading(true);
      const response = await api.get("/comunicados");
      // The API returns paginated data structure: { data: [...], ... }
      // Or sometimes directly the array depending on controller implementation.
      // Based on controller it returns: { success: true, data: { current_page: ..., data: [...] } }
      if (response.data.success && response.data.data.data) {
        setComunicados(response.data.data.data);
      } else {
        setComunicados([]);
      }
    } catch (error) {
      console.error("Erro ao carregar comunicados:", error);
      toast.error("Erro ao carregar comunicados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComunicados();
  }, []);

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({
      titulo: "",
      resumo: "",
      conteudo: "",
      data_publicacao: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleEdit = (comunicado: Comunicado) => {
    setEditingId(comunicado.id);
    setFormData({
      titulo: comunicado.titulo,
      resumo: comunicado.resumo,
      conteudo: comunicado.conteudo,
      data_publicacao: new Date(comunicado.data_publicacao).toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingId) {
      try {
        await api.delete(`/comunicados/${deletingId}`);
        toast.success("Comunicado excluído com sucesso.");
        fetchComunicados();
        setIsDeleteModalOpen(false);
        setDeletingId(null);
      } catch (error) {
        console.error("Erro ao excluir comunicado:", error);
        toast.error("Erro ao excluir comunicado.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/comunicados/${editingId}`, formData);
        toast.success("Comunicado atualizado com sucesso.");
      } else {
        await api.post("/comunicados", formData);
        toast.success("Comunicado criado com sucesso.");
      }
      fetchComunicados();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar comunicado:", error);
      toast.error("Erro ao salvar comunicado.");
    }
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
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Carregando comunicados...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {comunicados.length === 0 ? (
            <div className="card-corporate text-center py-12">
              <p className="text-muted-foreground">Nenhum comunicado cadastrado.</p>
            </div>
          ) : (
            comunicados.map((comunicado) => (
              <div key={comunicado.id} className="card-corporate">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                      <span>{new Date(comunicado.data_publicacao).toLocaleDateString('pt-BR')}</span>
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
            ))
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Editar Comunicado" : "Novo Comunicado"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Título do Comunicado *
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, titulo: e.target.value }))
                }
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                placeholder="Ex: Novo horário de funcionamento"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Data de Publicação *
                </label>
                <input
                  type="date"
                  value={formData.data_publicacao}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, data_publicacao: e.target.value }))
                  }
                  required
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Resumo *
              </label>
              <input
                type="text"
                value={formData.resumo}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, resumo: e.target.value }))
                }
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                placeholder="Uma breve descrição que aparecerá na listagem"
              />
              <p className="text-xs text-muted-foreground mt-1">Este texto será exibido nos cards da lista de comunicados.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Conteúdo Completo *
              </label>
              <div className="relative">
                <textarea
                  value={formData.conteudo}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, conteudo: e.target.value }))
                  }
                  required
                  rows={8}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all resize-y"
                  placeholder="Digite o conteúdo completo do comunicado..."
                />
                <p className="text-xs text-muted-foreground mt-1">Suporta formatação básica HTML.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors flex-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/90 transition-colors flex-1"
            >
              {editingId ? "Salvar Alterações" : "Publicar Comunicado"}
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
