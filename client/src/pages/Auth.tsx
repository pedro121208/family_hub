/**
 * @file pages/Auth.tsx
 * @description Pagina de autenticacao com login e cadastro
 */

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function AuthPage() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Estado para login
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Estado para registro
  const [regFamilyName, setRegFamilyName] = useState("");
  const [regAdminName, setRegAdminName] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(loginUsername, loginPassword);
      toast.success("Login realizado com sucesso!");
      setLoginUsername("");
      setLoginPassword("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(regFamilyName, regAdminName, regPassword);
      toast.success("Familia criada com sucesso!");
      setRegFamilyName("");
      setRegAdminName("");
      setRegPassword("");
      setIsLogin(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao registrar familia");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-md p-8 shadow-2xl">
        {isLogin ? (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-primary mb-2">⚡ Family Hub</h1>
              <p className="text-muted-foreground">Entrar no Hub</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Seu Nome</label>
                <Input
                  type="text"
                  placeholder="Ex: Joao"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Senha da Familia</label>
                <Input
                  type="password"
                  placeholder="Senha"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Carregando..." : "Acessar"}
              </Button>
            </form>

            <div className="text-center">
              <button
                onClick={() => setIsLogin(false)}
                className="text-sm text-primary hover:underline font-medium"
              >
                Nova familia? Crie uma conta aqui
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-primary mb-2">🏠 Criar Familia</h1>
              <p className="text-muted-foreground">Crie o ambiente restrito da sua familia</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome da Familia</label>
                <Input
                  type="text"
                  placeholder="Ex: Silva"
                  value={regFamilyName}
                  onChange={(e) => setRegFamilyName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Seu Nome (Administrador)</label>
                <Input
                  type="text"
                  placeholder="Ex: Maria"
                  value={regAdminName}
                  onChange={(e) => setRegAdminName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Crie uma Senha para a Familia</label>
                <Input
                  type="password"
                  placeholder="Senha segura"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Criando..." : "Criar Familia"}
              </Button>
            </form>

            <div className="text-center">
              <button
                onClick={() => setIsLogin(true)}
                className="text-sm text-primary hover:underline font-medium"
              >
                Ja tem uma conta? Faca Login
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
