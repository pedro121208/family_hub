/**
 * @file hooks/useNotifications.ts
 * @description Hook para gerenciar notificacoes do sistema
 */

import { useMemo } from "react";
import { useData } from "./useData";
import { daysUntil, getTodayISO } from "@/lib/formatting";
import type { Notification } from "@/types";

/**
 * Hook para obter notificacoes
 * @returns Array de notificacoes
 */
export function useNotifications(): Notification[] {
  const { database } = useData();
  const today = getTodayISO();

  return useMemo(() => {
    const notifications: Notification[] = [];

    // Atividades atrasadas
    database.atividades
      .filter((a) => !a.concluida && daysUntil(a.data) < 0)
      .forEach((a) => {
        notifications.push({
          id: `atv-${a.id}`,
          tipo: "atrasada",
          mensagem: `Atividade atrasada: ${a.descricao}`,
          data: a.data,
        });
      });

    // Atividades para hoje
    database.atividades
      .filter((a) => !a.concluida && a.data === today)
      .forEach((a) => {
        notifications.push({
          id: `today-${a.id}`,
          tipo: "hoje",
          mensagem: `Atividade para hoje: ${a.descricao}`,
          data: a.data,
        });
      });

    // Eventos de calendario para hoje
    database.calendario
      .filter((e) => e.data === today)
      .forEach((e) => {
        notifications.push({
          id: `cal-${e.id}`,
          tipo: "hoje",
          mensagem: `Evento hoje: ${e.descricao}`,
          data: e.data,
        });
      });

    return notifications;
  }, [database]);
}

/**
 * Hook para contar notificacoes
 * @returns Numero de notificacoes
 */
export function useNotificationCount(): number {
  const notifications = useNotifications();
  return notifications.length;
}
