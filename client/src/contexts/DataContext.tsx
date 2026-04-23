/**
 * @file contexts/DataContext.tsx
 * @description Contexto de dados para gerenciar estado global da aplicacao
 */

import { createContext, useCallback, useEffect, useState } from "react";
import type { DataContextType, FamilyHubDatabase, Activity, FamilyMember, CalendarEvent, ShoppingItem, Reward, MuralMessage, FamilyGoal } from "@/types";
import { getDatabase, saveDatabase } from "@/lib/storage";

export const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: React.ReactNode;
}

/**
 * Provider de dados
 */
export function DataProvider({ children }: DataProviderProps) {
  const [database, setDatabase] = useState<FamilyHubDatabase>(getDatabase());

  // Salva database sempre que muda
  useEffect(() => {
    saveDatabase(database);
  }, [database]);

  // Atividades
  const addActivity = useCallback((activity: Omit<Activity, "id">) => {
    setDatabase((prev) => ({
      ...prev,
      atividades: [
        ...prev.atividades,
        {
          ...activity,
          id: Date.now().toString(),
        },
      ],
    }));
  }, []);

  const updateActivity = useCallback((id: string, updates: Partial<Activity>) => {
    setDatabase((prev) => ({
      ...prev,
      atividades: prev.atividades.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
  }, []);

  const deleteActivity = useCallback((id: string) => {
    setDatabase((prev) => ({
      ...prev,
      atividades: prev.atividades.filter((a) => a.id !== id),
    }));
  }, []);

  // Membros
  const addMember = useCallback((member: Omit<FamilyMember, "id">) => {
    setDatabase((prev) => ({
      ...prev,
      membros: [
        ...prev.membros,
        {
          ...member,
          id: Date.now().toString(),
        },
      ],
    }));
  }, []);

  const updateMember = useCallback((id: string, updates: Partial<FamilyMember>) => {
    setDatabase((prev) => ({
      ...prev,
      membros: prev.membros.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    }));
  }, []);

  const deleteMember = useCallback((id: string) => {
    setDatabase((prev) => ({
      ...prev,
      membros: prev.membros.filter((m) => m.id !== id),
    }));
  }, []);

  // Eventos de calendario
  const addCalendarEvent = useCallback((event: Omit<CalendarEvent, "id">) => {
    setDatabase((prev) => ({
      ...prev,
      calendario: [
        ...prev.calendario,
        {
          ...event,
          id: Date.now().toString(),
        },
      ],
    }));
  }, []);

  const deleteCalendarEvent = useCallback((id: string) => {
    setDatabase((prev) => ({
      ...prev,
      calendario: prev.calendario.filter((e) => e.id !== id),
    }));
  }, []);

  // Itens de compras
  const addShoppingItem = useCallback((item: Omit<ShoppingItem, "id">) => {
    setDatabase((prev) => ({
      ...prev,
      compras: [
        ...prev.compras,
        {
          ...item,
          id: Date.now().toString(),
        },
      ],
    }));
  }, []);

  const updateShoppingItem = useCallback((id: string, updates: Partial<ShoppingItem>) => {
    setDatabase((prev) => ({
      ...prev,
      compras: prev.compras.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  }, []);

  const deleteShoppingItem = useCallback((id: string) => {
    setDatabase((prev) => ({
      ...prev,
      compras: prev.compras.filter((c) => c.id !== id),
    }));
  }, []);

  // Recompensas
  const addReward = useCallback((reward: Omit<Reward, "id">) => {
    setDatabase((prev) => ({
      ...prev,
      recompensas: [
        ...prev.recompensas,
        {
          ...reward,
          id: Date.now().toString(),
        },
      ],
    }));
  }, []);

  const deleteReward = useCallback((id: string) => {
    setDatabase((prev) => ({
      ...prev,
      recompensas: prev.recompensas.filter((r) => r.id !== id),
    }));
  }, []);

  // Mensagens do mural
  const addMuralMessage = useCallback((message: Omit<MuralMessage, "id">) => {
    setDatabase((prev) => ({
      ...prev,
      mural: [
        ...prev.mural,
        {
          ...message,
          id: Date.now().toString(),
        },
      ],
    }));
  }, []);

  const deleteMuralMessage = useCallback((id: string) => {
    setDatabase((prev) => ({
      ...prev,
      mural: prev.mural.filter((m) => m.id !== id),
    }));
  }, []);

  // Meta familiar
  const updateFamilyGoal = useCallback((goal: FamilyGoal) => {
    setDatabase((prev) => ({
      ...prev,
      metaFamiliar: goal,
    }));
  }, []);

  const value: DataContextType = {
    database,
    addActivity,
    updateActivity,
    deleteActivity,
    addMember,
    updateMember,
    deleteMember,
    addCalendarEvent,
    deleteCalendarEvent,
    addShoppingItem,
    updateShoppingItem,
    deleteShoppingItem,
    addReward,
    deleteReward,
    addMuralMessage,
    deleteMuralMessage,
    updateFamilyGoal,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
