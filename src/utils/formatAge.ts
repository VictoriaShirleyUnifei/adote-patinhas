// Converte uma data YYYY-MM-DD para "X anos e Y meses"
export function formatAgeFromDate(dateString: string): string {
  const birthDate = new Date(dateString);
  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  // Ajuste se os meses ficarem negativos
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // Construção da frase (lida com plural e zero)
  const yearStr =
    years > 0 ? `${years} ${years === 1 ? "ano" : "anos"}` : "";
  const monthStr =
    months > 0 ? `${months} ${months === 1 ? "mês" : "meses"}` : "";

  if (yearStr && monthStr) return `${yearStr} e ${monthStr}`;
  if (yearStr) return yearStr;
  if (monthStr) return monthStr;

  return "menos de 1 mês";
}
