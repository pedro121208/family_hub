/**
 * @file pages/Dashboard.tsx
 * @description Pagina principal do dashboard com todas as funcionalidades
 */

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useData } from "@/hooks/useData";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

type TabType = "atividades" | "calendario" | "compras" | "loja" | "mural" | "membros" | "ranking";

export default function DashboardPage() {
  const { currentUser, logout, familyName } = useAuth();
  const { database } = useData();
  const notifications = useNotifications();
  const [activeTab, setActiveTab] = useState<TabType>("atividades");
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const handleLogout = () => {
    logout();
    toast.success("Deslogado com sucesso!");
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    const html = document.documentElement;
    if (isDarkTheme) {
      html.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    } else {
      html.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
  };

  if (!currentUser) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-primary mb-2">⚡ Family Hub</h1>
          <p className="text-sm text-muted-foreground">{familyName}</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {[
            { id: "atividades" as TabType, label: "📋 Atividades" },
            { id: "calendario" as TabType, label: "📅 Calendario" },
            { id: "compras" as TabType, label: "🛒 Compras" },
            { id: "loja" as TabType, label: "🎁 Loja (Premios)" },
            { id: "mural" as TabType, label: "💬 Mural" },
            { id: "membros" as TabType, label: "👥 Familia / Cofre" },
            { id: "ranking" as TabType, label: "🏆 Ranking / Metas" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Button
            variant="outline"
            className="w-full justify-center"
            onClick={toggleTheme}
          >
            🌓 Tema
          </Button>
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLogout}
          >
            🚪 Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card border-b border-border px-8 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">🌤️ Ola, {currentUser.nome}!</h2>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Atividades</div>
              <div className="text-2xl font-bold">{database.atividades.length}</div>
            </div>

            {notifications.length > 0 && (
              <div className="relative">
                <button className="relative p-2 hover:bg-muted rounded-lg">
                  🔔
                  <span className="absolute top-0 right-0 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">
              {activeTab === "atividades" && "📋 Atividades"}
              {activeTab === "calendario" && "📅 Calendario"}
              {activeTab === "compras" && "🛒 Compras"}
              {activeTab === "loja" && "🎁 Loja de Recompensas"}
              {activeTab === "mural" && "💬 Mural da Familia"}
              {activeTab === "membros" && "👥 Membros da Familia"}
              {activeTab === "ranking" && "🏆 Ranking e Metas"}
            </h3>

            <div className="text-muted-foreground">
              Conteudo da aba {activeTab} sera implementado aqui.
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
