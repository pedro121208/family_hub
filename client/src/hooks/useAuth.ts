/**
 * @file hooks/useAuth.ts
 * @description Hook para acessar contexto de autenticacao
 */

import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

/**
 * Hook para acessar contexto de autenticacao
 * @returns Contexto de autenticacao
 * @throws Erro se usado fora de AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
