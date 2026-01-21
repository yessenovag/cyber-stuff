import React, { createContext, useContext, useState, useEffect } from "react";
import { apiPost, apiGet } from "../services/api";
import { User, AuthContextType } from "../types/index";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("cs_token")
  );
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!token) {
      localStorage.removeItem("cs_token");
      setUser(null);
      return;
    }

    localStorage.setItem("cs_token", token);

    apiGet("/auth/me", token)
      .then((user) => setUser(user))
      .catch(() => {
        setToken(null);
        setUser(null);
      });
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await apiPost("/auth/login", { email, password });
    localStorage.setItem("cs_token", res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const register = async (email: string, password: string) => {
    const res = await apiPost("/auth/register", { email, password });
    localStorage.setItem("cs_token", res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
