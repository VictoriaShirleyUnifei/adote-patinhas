export function formatDate(dateInput: string | Date | null | undefined): string {
  // Se for null/undefined ou string vazia, retorna mensagem padrão
  if (!dateInput) {
    return "Data não informada";
  }
  
  try {
    // Cria objeto Date
    const date = new Date(dateInput);
    
    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
      return "Data inválida";
    }
    
    // Extrai dia, mês e ano
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Janeiro é 0
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Erro ao formatar data:", error, dateInput);
    return "Data inválida";
  }
}

// Formata data relativa (hoje, ontem, etc.)
export function formatRelativeDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) {
    return "Data não informada";
  }
  
  try {
    const date = new Date(dateInput);
    
    if (isNaN(date.getTime())) {
      return "Data inválida";
    }
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Hoje
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `Hoje às ${hours}:${minutes}`;
    } else if (diffDays === 1) {
      return "Ontem";
    } else if (diffDays < 7) {
      return `Há ${diffDays} dias`;
    } else {
      return formatDate(date);
    }
  } catch (error) {
    console.error("Erro ao formatar data relativa:", error);
    return formatDate(dateInput);
  }
}