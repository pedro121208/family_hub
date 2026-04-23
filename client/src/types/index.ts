/**
 * @file types/index.ts
 * @description Definições de tipos TypeScript para o Family Hub
 */

/**
 * Papéis disponíveis na família
 */
export type FamilyRole = "Administrador" | "Pai" | "Mãe" | "Filho" | "Filha";

/**
 * Nível de dificuldade de atividades
 */
export type DifficultyLevel = "facil" | "media" | "dificil";

/**
 * Nível de importância de atividades
 */
export type ImportanceLevel = "normal" | "alta" | "urgente";

/**
 * Membro da família
 */
export interface FamilyMember {
  id: string;
  nome: string;
  avatar: string;
  papel: FamilyRole;
  pontos: number;
  saldo: number;
  tarefasConcluidas: number;
}

/**
 * Atividade/Tarefa
 */
export interface Activity {
  id: string;
  descricao: string;
  data: string; // ISO date format: YYYY-MM-DD
  membro: string;
  dificuldade: DifficultyLevel;
  importancia: ImportanceLevel;
  pontos: number;
  concluida: boolean;
  dataConclusao?: string;
}

/**
 * Evento do calendário
 */
export interface CalendarEvent {
  id: string;
  data: string; // ISO date format: YYYY-MM-DD
  descricao: string;
}

/**
 * Item de compras
 */
export interface ShoppingItem {
  id: string;
  descricao: string;
  comprado: boolean;
}

/**
 * Recompensa/Prêmio
 */
export interface Reward {
  id: string;
  nome: string;
  custo: number;
}

/**
 * Mensagem do mural
 */
export interface MuralMessage {
  id: string;
  autor: string;
  mensagem: string;
  data: string; // ISO date format: YYYY-MM-DD
  hora: string; // HH:MM format
}

/**
 * Meta familiar
 */
export interface FamilyGoal {
  objetivo: string;
  pontos: number;
}

/**
 * Dados de autenticação
 */
export interface AuthData {
  familyName: string;
  password: string; // Should be hashed in production
}

/**
 * Banco de dados completo
 */
export interface FamilyHubDatabase {
  atividades: Activity[];
  membros: FamilyMember[];
  mural: MuralMessage[];
  compras: ShoppingItem[];
  calendario: CalendarEvent[];
  recompensas: Reward[];
  metaFamiliar: FamilyGoal;
}

/**
 * Contexto de autenticação
 */
export interface AuthContextType {
  currentUser: FamilyMember | null;
  isAuthenticated: boolean;
  familyName: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (familyName: string, adminName: string, password: string) => Promise<void>;
  logout: () => void;
}

/**
 * Contexto de dados
 */
export interface DataContextType {
  database: FamilyHubDatabase;
  addActivity: (activity: Omit<Activity, "id">) => void;
  updateActivity: (id: string, activity: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  addMember: (member: Omit<FamilyMember, "id">) => void;
  updateMember: (id: string, member: Partial<FamilyMember>) => void;
  deleteMember: (id: string) => void;
  addCalendarEvent: (event: Omit<CalendarEvent, "id">) => void;
  deleteCalendarEvent: (id: string) => void;
  addShoppingItem: (item: Omit<ShoppingItem, "id">) => void;
  updateShoppingItem: (id: string, item: Partial<ShoppingItem>) => void;
  deleteShoppingItem: (id: string) => void;
  addReward: (reward: Omit<Reward, "id">) => void;
  deleteReward: (id: string) => void;
  addMuralMessage: (message: Omit<MuralMessage, "id">) => void;
  deleteMuralMessage: (id: string) => void;
  updateFamilyGoal: (goal: FamilyGoal) => void;
}

/**
 * Notificação do sistema
 */
export interface Notification {
  id: string;
  tipo: "atrasada" | "hoje" | "info";
  mensagem: string;
  data: string;
}

/**
 * Resposta de validação
 */
export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}
