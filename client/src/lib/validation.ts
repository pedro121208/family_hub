/**
 * @file lib/validation.ts
 * @description Schemas de validação com Zod
 */

import { z } from "zod";

/**
 * Schema para validação de login
 */
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Nome de usuário é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome não pode ter mais de 50 caracteres"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(4, "Senha deve ter pelo menos 4 caracteres")
    .max(100, "Senha não pode ter mais de 100 caracteres"),
});

/**
 * Schema para validação de registro
 */
export const registerSchema = z.object({
  familyName: z
    .string()
    .min(1, "Nome da família é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome não pode ter mais de 50 caracteres"),
  adminName: z
    .string()
    .min(1, "Nome do administrador é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome não pode ter mais de 50 caracteres"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(4, "Senha deve ter pelo menos 4 caracteres")
    .max(100, "Senha não pode ter mais de 100 caracteres"),
});

/**
 * Schema para validação de atividade
 */
export const activitySchema = z.object({
  descricao: z
    .string()
    .min(1, "Descrição é obrigatória")
    .min(3, "Descrição deve ter pelo menos 3 caracteres")
    .max(200, "Descrição não pode ter mais de 200 caracteres"),
  data: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
  membro: z.string().min(1, "Membro é obrigatório"),
  dificuldade: z.enum(["facil", "media", "dificil"]),
  importancia: z.enum(["normal", "alta", "urgente"]),
});

/**
 * Schema para validação de evento de calendário
 */
export const calendarEventSchema = z.object({
  data: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
  descricao: z
    .string()
    .min(1, "Descrição é obrigatória")
    .min(3, "Descrição deve ter pelo menos 3 caracteres")
    .max(200, "Descrição não pode ter mais de 200 caracteres"),
});

/**
 * Schema para validação de item de compras
 */
export const shoppingItemSchema = z.object({
  descricao: z
    .string()
    .min(1, "Descrição é obrigatória")
    .min(2, "Descrição deve ter pelo menos 2 caracteres")
    .max(100, "Descrição não pode ter mais de 100 caracteres"),
});

/**
 * Schema para validação de recompensa
 */
export const rewardSchema = z.object({
  nome: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome não pode ter mais de 100 caracteres"),
  custo: z
    .number()
    .int("Custo deve ser um número inteiro")
    .positive("Custo deve ser positivo")
    .max(10000, "Custo não pode ser maior que 10000"),
});

/**
 * Schema para validação de mensagem do mural
 */
export const muralMessageSchema = z.object({
  mensagem: z
    .string()
    .min(1, "Mensagem é obrigatória")
    .min(2, "Mensagem deve ter pelo menos 2 caracteres")
    .max(500, "Mensagem não pode ter mais de 500 caracteres"),
});

/**
 * Schema para validação de meta familiar
 */
export const familyGoalSchema = z.object({
  objetivo: z
    .string()
    .min(1, "Objetivo é obrigatório")
    .min(5, "Objetivo deve ter pelo menos 5 caracteres")
    .max(200, "Objetivo não pode ter mais de 200 caracteres"),
  pontos: z
    .number()
    .int("Pontos deve ser um número inteiro")
    .positive("Pontos deve ser positivo")
    .max(100000, "Pontos não pode ser maior que 100000"),
});

/**
 * Tipos derivados dos schemas
 */
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ActivityInput = z.infer<typeof activitySchema>;
export type CalendarEventInput = z.infer<typeof calendarEventSchema>;
export type ShoppingItemInput = z.infer<typeof shoppingItemSchema>;
export type RewardInput = z.infer<typeof rewardSchema>;
export type MuralMessageInput = z.infer<typeof muralMessageSchema>;
export type FamilyGoalInput = z.infer<typeof familyGoalSchema>;

/**
 * Função genérica para validar dados
 * @param schema - Schema Zod
 * @param data - Dados a validar
 * @returns Dados validados ou erro
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((err: z.ZodIssue) => {
        const path = err.path.join(".");
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: "Erro de validação desconhecido" } };
  }
}

/**
 * Sanitiza string para prevenir XSS
 * @param input - String a sanitizar
 * @returns String sanitizada
 */
export function sanitizeInput(input: string): string {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
}

/**
 * Valida e sanitiza email
 * @param email - Email a validar
 * @returns true se válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida força de senha
 * @param password - Senha a validar
 * @returns Nível de força (0-4)
 */
export function getPasswordStrength(password: string): number {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[!@#$%^&*]/.test(password)) strength++;

  return Math.min(strength, 4);
}

/**
 * Valida data ISO
 * @param dateString - Data em formato ISO
 * @returns true se válida
 */
export function isValidISODate(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}
