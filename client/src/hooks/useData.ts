/**
 * @file hooks/useData.ts
 * @description Hook para acessar contexto de dados
 */

import { useContext } from "react";
import { DataContext } from "@/contexts/DataContext";

/**
 * Hook para acessar contexto de dados
 * @returns Contexto de dados
 * @throws Erro se usado fora de DataProvider
 */
export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData deve ser usado dentro de DataProvider");
  }
  return context;
}
