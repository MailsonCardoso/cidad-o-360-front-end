export const categories = [
  "Segurança Pública",
  "Defesa do Consumidor",
  "Mobilidade",
  "Legislação Participativa",
  "Meio Ambiente",
  "Saúde",
  "Educação",
  "Infraestrutura",
];

export const statusOptions = ["Aberto", "Em andamento", "Concluído"];

export const mockDemandas = [
  {
    id: "1",
    protocolo: "C360-00001",
    nome: "João Silva",
    cpf: "123.456.789-00",
    telefone: "(11) 99999-9999",
    email: "joao@email.com",
    categoria: "Segurança Pública",
    assunto: "Iluminação Pública",
    descricao: "Solicito a instalação de iluminação pública na Rua das Flores, número 150. O local está muito escuro e oferece risco à segurança dos moradores.",
    status: "Aberto",
    data: "2024-01-15",
    anexos: [],
    historico: [
      {
        date: "15/01/2024 - 10:30",
        status: "Demanda Registrada",
        description: "Demanda registrada com sucesso no sistema.",
      },
    ],
  },
  {
    id: "2",
    protocolo: "C360-00002",
    nome: "Maria Santos",
    cpf: "987.654.321-00",
    telefone: "(11) 98888-8888",
    email: "maria@email.com",
    categoria: "Mobilidade",
    assunto: "Buraco na Via",
    descricao: "Existe um buraco grande na Avenida Principal, próximo ao número 500, causando transtornos ao trânsito e risco de acidentes.",
    status: "Em andamento",
    data: "2024-01-14",
    anexos: ["foto_buraco.jpg"],
    historico: [
      {
        date: "14/01/2024 - 14:00",
        status: "Demanda Registrada",
        description: "Demanda registrada com sucesso no sistema.",
      },
      {
        date: "15/01/2024 - 09:00",
        status: "Em Análise",
        description: "Demanda encaminhada para o setor de Infraestrutura.",
      },
      {
        date: "16/01/2024 - 11:30",
        status: "Equipe Designada",
        description: "Equipe técnica designada para avaliação no local.",
      },
    ],
  },
  {
    id: "3",
    protocolo: "C360-00003",
    nome: "Carlos Oliveira",
    cpf: "456.789.123-00",
    telefone: "(11) 97777-7777",
    email: "carlos@email.com",
    categoria: "Defesa do Consumidor",
    assunto: "Cobrança Indevida",
    descricao: "Recebi cobrança indevida de uma empresa de telefonia. Solicito orientação sobre como proceder.",
    status: "Concluído",
    data: "2024-01-10",
    anexos: ["comprovante.pdf"],
    historico: [
      {
        date: "10/01/2024 - 08:00",
        status: "Demanda Registrada",
        description: "Demanda registrada com sucesso no sistema.",
      },
      {
        date: "10/01/2024 - 16:00",
        status: "Em Análise",
        description: "Demanda encaminhada para o PROCON.",
      },
      {
        date: "12/01/2024 - 10:00",
        status: "Resposta Enviada",
        description: "Orientações enviadas por e-mail ao cidadão.",
      },
      {
        date: "15/01/2024 - 14:30",
        status: "Concluído",
        description: "Cidadão confirmou resolução do problema. Demanda encerrada.",
      },
    ],
  },
  {
    id: "4",
    protocolo: "C360-00004",
    nome: "Ana Paula Costa",
    cpf: "321.654.987-00",
    telefone: "(11) 96666-6666",
    email: "ana@email.com",
    categoria: "Legislação Participativa",
    assunto: "Sugestão de Lei",
    descricao: "Gostaria de sugerir a criação de uma lei municipal para incentivo à energia solar em residências.",
    status: "Em andamento",
    data: "2024-01-12",
    anexos: [],
    historico: [
      {
        date: "12/01/2024 - 09:00",
        status: "Demanda Registrada",
        description: "Sugestão de lei registrada no sistema.",
      },
      {
        date: "13/01/2024 - 14:00",
        status: "Encaminhada",
        description: "Sugestão encaminhada para análise da Câmara Municipal.",
      },
    ],
  },
  {
    id: "5",
    protocolo: "C360-00005",
    nome: "Pedro Henrique",
    cpf: "654.321.987-00",
    telefone: "(11) 95555-5555",
    email: "pedro@email.com",
    categoria: "Meio Ambiente",
    assunto: "Descarte Irregular de Lixo",
    descricao: "Há um terreno baldio na Rua dos Ipês onde moradores estão descartando lixo irregularmente.",
    status: "Aberto",
    data: "2024-01-16",
    anexos: ["foto_terreno.jpg"],
    historico: [
      {
        date: "16/01/2024 - 11:00",
        status: "Demanda Registrada",
        description: "Demanda registrada com sucesso no sistema.",
      },
    ],
  },
];

export const mockComunicados = [
  {
    id: "1",
    titulo: "Novo Horário de Atendimento",
    data: "16/01/2024",
    resumo: "A partir de fevereiro, o atendimento presencial terá novo horário de funcionamento.",
    conteudo: `
      <p>Prezados cidadãos,</p>
      <p>Informamos que a partir de 01 de fevereiro de 2024, o atendimento presencial do Portal Cidadão 360 funcionará em novo horário:</p>
      <ul>
        <li>Segunda a Sexta: 08h às 17h</li>
        <li>Sábados: 08h às 12h</li>
      </ul>
      <p>O atendimento digital permanece disponível 24 horas por dia, 7 dias por semana.</p>
      <p>Agradecemos a compreensão.</p>
    `,
  },
  {
    id: "2",
    titulo: "Campanha de Conscientização Ambiental",
    data: "14/01/2024",
    resumo: "Participe da campanha de coleta seletiva em parceria com a Secretaria de Meio Ambiente.",
    conteudo: `
      <p>A Prefeitura Municipal, em parceria com a Secretaria de Meio Ambiente, lança a campanha "Cidade Limpa, Cidade Feliz".</p>
      <p>Durante todo o mês de janeiro, estaremos realizando ações de conscientização sobre descarte correto de resíduos e coleta seletiva.</p>
      <p><strong>Cronograma de Ações:</strong></p>
      <ul>
        <li>20/01 - Palestra sobre reciclagem (Praça Central)</li>
        <li>25/01 - Mutirão de limpeza (Parque Municipal)</li>
        <li>30/01 - Feira de trocas sustentáveis</li>
      </ul>
      <p>Participe e ajude a construir uma cidade mais sustentável!</p>
    `,
  },
  {
    id: "3",
    titulo: "Recadastramento de Comerciantes",
    data: "10/01/2024",
    resumo: "Comerciantes devem realizar recadastramento até o final de fevereiro.",
    conteudo: `
      <p>A Secretaria de Desenvolvimento Econômico informa que todos os comerciantes do município devem realizar o recadastramento obrigatório até 28 de fevereiro de 2024.</p>
      <p><strong>Documentos necessários:</strong></p>
      <ul>
        <li>CNPJ atualizado</li>
        <li>Alvará de funcionamento</li>
        <li>Documento de identidade do responsável</li>
        <li>Comprovante de endereço comercial</li>
      </ul>
      <p>O recadastramento pode ser feito presencialmente ou pelo Portal Cidadão 360.</p>
    `,
  },
  {
    id: "4",
    titulo: "Obras na Avenida Principal",
    data: "08/01/2024",
    resumo: "Informações sobre as obras de revitalização da Avenida Principal e desvios de trânsito.",
    conteudo: `
      <p>Informamos que terão início no dia 15 de janeiro as obras de revitalização da Avenida Principal.</p>
      <p><strong>Período das obras:</strong> 15/01 a 15/03/2024</p>
      <p><strong>Alterações no trânsito:</strong></p>
      <ul>
        <li>Interdição parcial da via entre os números 100 e 500</li>
        <li>Desvio pela Rua das Palmeiras</li>
        <li>Funcionamento normal do transporte público com alteração de itinerário</li>
      </ul>
      <p>Pedimos desculpas pelos transtornos e agradecemos a compreensão.</p>
    `,
  },
];

export const getStatusClass = (status: string) => {
  switch (status) {
    case "Aberto":
      return "status-open";
    case "Em andamento":
      return "status-progress";
    case "Concluído":
      return "status-completed";
    default:
      return "";
  }
};

export const generateProtocol = () => {
  const num = Math.floor(Math.random() * 99999) + 1;
  return `C360-${num.toString().padStart(5, "0")}`;
};
