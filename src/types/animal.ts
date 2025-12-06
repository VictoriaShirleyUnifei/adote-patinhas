export interface Animal {
  id: string;

  // Dados básicos
  nome: string;
  foto: string;
  dataNascimento: string;
  sexo: string;
  porte: string;
  raca: string;
  especie: string;
  descricao: string;
  isInterested?: boolean;

  // Distância (opcional)
  distance?: string;

  // Saúde
  saude?: {
    vacinado: boolean;
    vermifugado: boolean;
    castrado: boolean;
  };

  // Convivência
  convivencia?: {
    outrosAnimais: boolean;
    criancas: boolean;
  };

  // Condições especiais
  condicoes?: {
    cuidadosEspeciais: boolean;
    idoso: boolean;
    deficiencia: boolean;
  };

  // Tutor / responsável
  tutor?: {
    nome: string;
    telefone: string;
    avatar?: string;
  };

  // Publicação
  dataPublicacao?: string;
}
