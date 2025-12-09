import { useState, useEffect } from 'react';

interface UserData {
  nome: string;
  email: string;
  foto?: string;
  phone?: string;
  cep?: string;
  uf?: string;
  city?: string;
  street?: string;
}

export function useUserData() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para normalizar URL
  const getValidImageUrl = (url: string | undefined): string | undefined => {
    if (!url) return undefined;
    
    if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('/')) {
      return url;
    }
    
    return `/${url}`;
  };

  // Carrega dados do usuário
  const loadUserData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/profile", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error('Erro ao carregar dados do usuário');
      }

      const user = await res.json();
      setUserData({
        nome: user.nome || "Usuário",
        email: user.email || "",
        foto: user.foto ? getValidImageUrl(user.foto) : undefined,
        phone: user.phone || "",
        cep: user.cep || "",
        uf: user.uf || "",
        city: user.city || "",
        street: user.street || "",
      });
      setError(null);
    } catch (err) {
      console.error("Erro ao carregar dados do usuário:", err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  // Atualiza dados do usuário
  const updateUserData = (newData: Partial<UserData>) => {
    setUserData(prev => prev ? { ...prev, ...newData } : null);
  };

  useEffect(() => {
    loadUserData();
  }, []);

  return {
    userData,
    loading,
    error,
    refresh: loadUserData,
    updateUserData,
  };
}