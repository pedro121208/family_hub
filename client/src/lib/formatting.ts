/**
 * @file lib/formatting.ts
 * @description Funcoes de formatacao de dados
 */

/**
 * Formata data ISO para formato brasileiro
 * @param dateISO - Data em formato ISO (YYYY-MM-DD)
 * @returns Data formatada (DD/MM/YYYY)
 */
export function formatDateBR(dateISO: string): string {
  if (!dateISO) return "Sem data";

  try {
    const parts = dateISO.split("-");
    if (parts.length !== 3) return dateISO;

    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  } catch {
    return dateISO;
  }
}

/**
 * Converte data ISO para objeto Date
 * @param dateISO - Data em formato ISO
 * @returns Objeto Date
 */
export function parseISODate(dateISO: string): Date {
  return new Date(dateISO + "T00:00:00Z");
}

/**
 * Formata data completa com dia da semana
 * @param dateISO - Data em formato ISO
 * @returns String formatada
 */
export function formatFullDate(dateISO: string): string {
  try {
    const date = parseISODate(dateISO);
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateISO;
  }
}

/**
 * Formata hora no formato HH:MM
 * @param hours - Horas
 * @param minutes - Minutos
 * @returns String formatada (ex: "14:30")
 */
export function formatTime(hours: number, minutes: number): string {
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/**
 * Obtem hora atual no formato HH:MM
 * @returns String formatada
 */
export function getCurrentTime(): string {
  const now = new Date();
  return formatTime(now.getHours(), now.getMinutes());
}

/**
 * Obtem data atual em formato ISO
 * @returns String em formato YYYY-MM-DD
 */
export function getTodayISO(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Calcula pontos baseado em dificuldade e importancia
 * @param difficulty - Nivel de dificuldade
 * @param importance - Nivel de importancia
 * @returns Pontos calculados
 */
export function calculatePoints(
  difficulty: "facil" | "media" | "dificil",
  importance: "normal" | "alta" | "urgente"
): number {
  let basePoints = 10;

  // Pontos por dificuldade
  if (difficulty === "media") basePoints += 5;
  if (difficulty === "dificil") basePoints += 10;

  // Pontos por importancia
  if (importance === "alta") basePoints += 5;
  if (importance === "urgente") basePoints += 10;

  return basePoints;
}

/**
 * Formata numero de pontos com simbolo
 * @param points - Numero de pontos
 * @returns String formatada (ex: "50 pts")
 */
export function formatPoints(points: number): string {
  return `${points} pts`;
}

/**
 * Calcula dias ate uma data
 * @param dateISO - Data em formato ISO
 * @returns Numero de dias (negativo se passado)
 */
export function daysUntil(dateISO: string): number {
  const today = new Date(getTodayISO());
  const target = parseISODate(dateISO);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Formata descricao de dias ate data
 * @param dateISO - Data em formato ISO
 * @returns String descritiva
 */
export function formatDaysUntil(dateISO: string): string {
  const days = daysUntil(dateISO);

  if (days === 0) return "hoje";
  if (days === 1) return "amanha";
  if (days === -1) return "ontem";
  if (days > 0) return `em ${days} dias`;
  if (days < 0) return `${Math.abs(days)} dias atras`;

  return "";
}

/**
 * Obtem status de uma atividade
 * @param dateISO - Data da atividade
 * @param concluida - Se foi concluida
 * @returns Status
 */
export function getActivityStatus(
  dateISO: string,
  concluida: boolean
): "atrasada" | "hoje" | "futura" | "concluida" {
  if (concluida) return "concluida";

  const days = daysUntil(dateISO);

  if (days < 0) return "atrasada";
  if (days === 0) return "hoje";
  return "futura";
}

/**
 * Formata nome de mes
 * @param monthIndex - Indice do mes (0-11)
 * @returns Nome do mes
 */
export function getMonthName(monthIndex: number): string {
  const months = [
    "Janeiro",
    "Fevereiro",
    "Marco",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  return months[monthIndex] || "";
}

/**
 * Formata nome de dia da semana
 * @param dayIndex - Indice do dia (0-6, 0=domingo)
 * @returns Nome do dia
 */
export function getDayName(dayIndex: number): string {
  const days = ["Domingo", "Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado"];
  return days[dayIndex] || "";
}

/**
 * Formata nome de dia da semana abreviado
 * @param dayIndex - Indice do dia (0-6)
 * @returns Nome abreviado
 */
export function getDayNameShort(dayIndex: number): string {
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
  return days[dayIndex] || "";
}

/**
 * Capitaliza primeira letra de string
 * @param str - String a capitalizar
 * @returns String capitalizada
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Trunca string com ellipsis
 * @param str - String a truncar
 * @param maxLength - Comprimento maximo
 * @returns String truncada
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}
