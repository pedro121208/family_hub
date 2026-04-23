/**
 * @file contexts/AuthContext.tsx
 * @description Contexto de autenticacao para gerenciar usuario logado
 */

import { createContext, useCallback, useEffect, useState } from "react";
import type { AuthContextType, FamilyMember } from "@/types";
import { getAuthData, saveAuthData, clearAuthData, getDatabase, saveDatabase } from "@/lib/storage";
import { validate, loginSchema, registerSchema } from "@/lib/validation";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Estender interface para incluir isAuthenticated
interface ExtendedAuthContextType extends AuthContextType {
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Provider de autenticacao
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<FamilyMember | null>(null);
  const [familyName, setFamilyName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaura sessao ao montar
  useEffect(() => {
    const authData = getAuthData();
    if (authData) {
      setFamilyName(authData.familyName);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (username: string, password: string): Promise<void> => {
      try {
        // Valida entrada
        const validation = validate(loginSchema, { username, password });
        if (!validation.success) {
          throw new Error(Object.values(validation.errors).join(", "));
        }

        // Verifica autenticacao
        const authData = getAuthData();
        if (!authData) {
          throw new Error("Nenhuma familia cadastrada!");
        }

        if (password !== authData.password) {
          throw new Error("Senha incorreta!");
        }

        // Procura usuario
        const db = getDatabase();
        const user = db.membros.find((m) => m.nome.toLowerCase() === username.toLowerCase());

        if (!user) {
          throw new Error("Usuario nao cadastrado!");
        }

        setCurrentUser(user);
        setFamilyName(authData.familyName);
      } catch (error) {
        throw error instanceof Error ? error : new Error("Erro ao fazer login");
      }
    },
    []
  );

  const register = useCallback(
    async (familyName: string, adminName: string, password: string): Promise<void> => {
      try {
        // Valida entrada
        const validation = validate(registerSchema, { familyName, adminName, password });
        if (!validation.success) {
          throw new Error(Object.values(validation.errors).join(", "));
        }

        // Salva autenticacao
        saveAuthData({ familyName, password });

        // Cria primeiro membro (administrador)
        const db = getDatabase();
        const newMember: FamilyMember = {
          id: Date.now().toString(),
          nome: adminName,
          avatar: "👑",
          papel: "Administrador",
          pontos: 0,
          saldo: 0,
          tarefasConcluidas: 0,
        };

        db.membros.push(newMember);
        saveDatabase(db);

        setCurrentUser(newMember);
        setFamilyName(familyName);
      } catch (error) {
        throw error instanceof Error ? error : new Error("Erro ao registrar familia");
      }
    },
    []
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    setFamilyName(null);
    clearAuthData();
  }, []);

  const value: AuthContextType = {
    currentUser,
    isAuthenticated: currentUser !== null,
    familyName,
    login,
    register,
    logout,
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
