/**
 * @file lib/storage.ts
 * @description Gerenciamento seguro de localStorage com validação
 */

import type { FamilyHubDatabase, AuthData } from "@/types";

const DB_KEY = "familyHubDB";
const AUTH_KEY = "familyAuthDB";
const THEME_KEY = "theme";

/**
 * Valor padrão do banco de dados
 */
const DEFAULT_DB: FamilyHubDatabase = {
  atividades: [],
  membros: [],
  mural: [],
  compras: [],
  calendario: [],
  recompensas: [
    { id: "def1", nome: "Escolher o filme do final de semana", custo: 50 },
    { id: "def2", nome: "Pedir Pizza", custo: 100 },
    { id: "def3", nome: "1h a mais no PC/Videogame", custo: 30 },
  ],
  metaFamiliar: { objetivo: "Defina uma meta!", pontos: 1000 },
};

/**
 * Obtém o banco de dados do localStorage com validação
 * @returns Banco de dados validado
 */
export function getDatabase(): FamilyHubDatabase {
  try {
    const stored = localStorage.getItem(DB_KEY);
    if (!stored) {
      return { ...DEFAULT_DB };
    }

    const parsed = JSON.parse(stored);

    // Validação básica da estrutura
    if (!isValidDatabase(parsed)) {
      console.warn("Banco de dados inválido, usando padrão");
      return { ...DEFAULT_DB };
    }

    return parsed as FamilyHubDatabase;
  } catch (error) {
    console.error("Erro ao ler banco de dados:", error);
    return { ...DEFAULT_DB };
  }
}

/**
 * Salva o banco de dados no localStorage
 * @param db - Banco de dados a salvar
 */
export function saveDatabase(db: FamilyHubDatabase): void {
  try {
    if (!isValidDatabase(db)) {
      throw new Error("Banco de dados inválido");
    }
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (error) {
    console.error("Erro ao salvar banco de dados:", error);
    throw new Error("Falha ao salvar dados");
  }
}

/**
 * Obtém os dados de autenticação
 * @returns Dados de autenticação ou null
 */
export function getAuthData(): AuthData | null {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored);

    if (!isValidAuthData(parsed)) {
      console.warn("Dados de autenticação inválidos");
      return null;
    }

    return parsed as AuthData;
  } catch (error) {
    console.error("Erro ao ler dados de autenticação:", error);
    return null;
  }
}

/**
 * Salva os dados de autenticação
 * @param auth - Dados de autenticação a salvar
 */
export function saveAuthData(auth: AuthData): void {
  try {
    if (!isValidAuthData(auth)) {
      throw new Error("Dados de autenticação inválidos");
    }
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  } catch (error) {
    console.error("Erro ao salvar dados de autenticação:", error);
    throw new Error("Falha ao salvar autenticação");
  }
}

/**
 * Remove os dados de autenticação (logout)
 */
export function clearAuthData(): void {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch (error) {
    console.error("Erro ao limpar autenticação:", error);
  }
}

/**
 * Obtém o tema salvo
 * @returns "light" ou "dark"
 */
export function getTheme(): "light" | "dark" {
  try {
    const theme = localStorage.getItem(THEME_KEY);
    return theme === "light" || theme === "dark" ? theme : "dark";
  } catch {
    return "dark";
  }
}

/**
 * Salva o tema
 * @param theme - "light" ou "dark"
 */
export function saveTheme(theme: "light" | "dark"): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error("Erro ao salvar tema:", error);
  }
}

/**
 * Valida a estrutura do banco de dados
 * @param data - Dados a validar
 * @returns true se válido
 */
function isValidDatabase(data: unknown): data is FamilyHubDatabase {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const db = data as Record<string, unknown>;

  return (
    Array.isArray(db.atividades) &&
    Array.isArray(db.membros) &&
    Array.isArray(db.mural) &&
    Array.isArray(db.compras) &&
    Array.isArray(db.calendario) &&
    Array.isArray(db.recompensas) &&
    typeof db.metaFamiliar === "object" &&
    db.metaFamiliar !== null
  );
}

/**
 * Valida a estrutura dos dados de autenticação
 * @param data - Dados a validar
 * @returns true se válido
 */
function isValidAuthData(data: unknown): data is AuthData {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const auth = data as Record<string, unknown>;

  return (
    typeof auth.familyName === "string" &&
    auth.familyName.length > 0 &&
    typeof auth.password === "string" &&
    auth.password.length > 0
  );
}

/**
 * Limpa todo o armazenamento local (cuidado!)
 */
export function clearAllStorage(): void {
  try {
    localStorage.removeItem(DB_KEY);
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(THEME_KEY);
  } catch (error) {
    console.error("Erro ao limpar armazenamento:", error);
  }
}

/**
 * Exporta o banco de dados como JSON
 * @returns String JSON do banco de dados
 */
export function exportDatabase(): string {
  try {
    const db = getDatabase();
    return JSON.stringify(db, null, 2);
  } catch (error) {
    console.error("Erro ao exportar banco de dados:", error);
    throw new Error("Falha ao exportar dados");
  }
}

/**
 * Importa um banco de dados de JSON
 * @param jsonString - String JSON do banco de dados
 */
export function importDatabase(jsonString: string): void {
  try {
    const parsed = JSON.parse(jsonString);
    if (!isValidDatabase(parsed)) {
      throw new Error("Formato de banco de dados inválido");
    }
    saveDatabase(parsed as FamilyHubDatabase);
  } catch (error) {
    console.error("Erro ao importar banco de dados:", error);
    throw new Error("Falha ao importar dados");
  }
}
