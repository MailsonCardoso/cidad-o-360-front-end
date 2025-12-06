import { useState } from "react";
import { Upload, CheckCircle, FileText } from "lucide-react";
import Modal from "@/components/shared/Modal";
import { categories } from "@/data/mockData";
import api from "../../services/api";
import { toast } from "sonner";

const CadastroDemanda = () => {
    const [formData, setFormData] = useState({
        nome: "",
        cpf: "",
        telefone: "",
        email: "",
        categoria: "",
        assunto: "",
        descricao: "",
        arquivo: null as File | null,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [protocolo, setProtocolo] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData((prev) => ({ ...prev, arquivo: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const data = new FormData();
            data.append("categoria", formData.categoria); // User selects category
            data.append("assunto", formData.assunto);
            data.append("descricao", formData.descricao);

            const fullDescription = `${formData.descricao}\n\n--- DADOS DE CONTATO DO SOLICITANTE ---\nSolicitante: ${formData.nome}\nCPF: ${formData.cpf}\nTel: ${formData.telefone}\nEmail: ${formData.email}`;
            data.append("descricao", fullDescription);

            if (formData.arquivo) {
                data.append("arquivo", formData.arquivo);
            }

            const response = await api.post("/demandas", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                setProtocolo(response.data.data.protocolo);
                setIsModalOpen(true);
                // Reset form
                setFormData({
                    nome: "",
                    cpf: "",
                    telefone: "",
                    email: "",
                    categoria: "",
                    assunto: "",
                    descricao: "",
                    arquivo: null
                });
            }
        } catch (error: any) {
            console.error(error);
            toast.error("Erro ao registrar demanda. Tente novamente.");
        }
    };

    const formatCPF = (value: string) => {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})/, "$1-$2")
            .replace(/(-\d{2})\d+?$/, "$1");
    };

    const formatPhone = (value: string) => {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2")
            .replace(/(-\d{4})\d+?$/, "$1");
    };

    return (
        <div className="py-6 animate-fade-in">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
                        <FileText className="w-8 h-8 text-secondary" />
                        Cadastro de Demanda (Interno)
                    </h1>
                    <p className="text-muted-foreground">
                        Utilize este formulário para registrar demandas presenciais ou por telefone.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="card-corporate space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="nome" className="label-corporate">
                                Nome do Solicitante *
                            </label>
                            <input
                                type="text"
                                id="nome"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                required
                                className="input-corporate"
                                placeholder="Nome completo do cidadão"
                            />
                        </div>

                        <div>
                            <label htmlFor="cpf" className="label-corporate">
                                CPF *
                            </label>
                            <input
                                type="text"
                                id="cpf"
                                name="cpf"
                                value={formData.cpf}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, cpf: formatCPF(e.target.value) }))
                                }
                                required
                                maxLength={14}
                                className="input-corporate"
                                placeholder="000.000.000-00"
                            />
                        </div>

                        <div>
                            <label htmlFor="telefone" className="label-corporate">
                                Telefone *
                            </label>
                            <input
                                type="text"
                                id="telefone"
                                name="telefone"
                                value={formData.telefone}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, telefone: formatPhone(e.target.value) }))
                                }
                                required
                                maxLength={15}
                                className="input-corporate"
                                placeholder="(00) 00000-0000"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="label-corporate">
                                E-mail *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="input-corporate"
                                placeholder="email@cidadao.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="categoria" className="label-corporate">
                            Setor Responsável *
                        </label>
                        <select
                            id="categoria"
                            name="categoria"
                            value={formData.categoria}
                            onChange={handleChange}
                            required
                            className="input-corporate"
                        >
                            <option value="">Selecione o setor de destino ou Triagem</option>
                            <option value="Triagem">Triagem (Atendimento Geral)</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="assunto" className="label-corporate">
                            Assunto *
                        </label>
                        <input
                            type="text"
                            id="assunto"
                            name="assunto"
                            value={formData.assunto}
                            onChange={handleChange}
                            required
                            className="input-corporate"
                            placeholder="Resumo da solicitação"
                        />
                    </div>

                    <div>
                        <label htmlFor="descricao" className="label-corporate">
                            Descrição Detalhada *
                        </label>
                        <textarea
                            id="descricao"
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleChange}
                            required
                            rows={5}
                            className="input-corporate resize-none"
                            placeholder="Descreva a solicitação em detalhes..."
                        />
                    </div>

                    <div>
                        <label className="label-corporate">Anexar Arquivo (opcional)</label>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-secondary/50 transition-colors">
                            <input
                                type="file"
                                id="arquivo"
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            />
                            <label htmlFor="arquivo" className="cursor-pointer">
                                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                                {formData.arquivo ? (
                                    <p className="text-sm text-foreground font-medium">{formData.arquivo.name}</p>
                                ) : (
                                    <>
                                        <p className="text-sm text-muted-foreground">
                                            Clique para selecionar ou arraste o arquivo
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            PDF, JPG, PNG, DOC (máx. 10MB)
                                        </p>
                                    </>
                                )}
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary w-full">
                        Registrar Demanda Interna
                    </button>
                </form>

                {/* Success Modal */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Demanda Registrada">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-success" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                            Demanda registrada com sucesso!
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            Protocolo gerado:
                        </p>
                        <div className="bg-muted rounded-lg p-4 mb-6">
                            <p className="text-2xl font-bold text-secondary">{protocolo}</p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="btn-primary"
                        >
                            Fechar
                        </button>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default CadastroDemanda;
