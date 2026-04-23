/**
 * @file pages/Home.tsx
 * @description Pagina principal - redireciona para auth ou dashboard
 */

import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import AuthPage from "./Auth";
import DashboardPage from "./Dashboard";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redireciona para dashboard se autenticado
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  if (isAuthenticated) {
    return <DashboardPage />;
  }

  return <AuthPage />;
}
