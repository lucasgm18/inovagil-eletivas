import { ReactNode, createContext, useEffect, useState } from "react";
import { api } from "../lib/axios";

export interface AuthContextProps {
  login: ({
    matricula,
    dataDeNascimento,
  }: {
    matricula: string;
    dataDeNascimento: string;
  }) => void;
  user: UserProps | undefined;
  authorized: boolean | undefined;
  logout: () => void;
}

export interface UserProps {
  matricula: string;
  dataDeNascimento: string;
  nome: string;
  serie: string;
  curso: string;
  turmasCadastradas: {
    id: string;
    classesId: string;
    studentId: string;
  }[];
}

export interface AuthData extends UserProps {
  token: string;
}

export const AuthContext = createContext({} as AuthContextProps);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProps>();
  const [authorized, setAuthorized] = useState<boolean | undefined>();

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  async function loadFromLocalStorage() {
    const token = localStorage.getItem("token");
    if (token) {
      const verifiedToken = await verifyToken(JSON.parse(token));
      if (verifiedToken) {
        const user = await api.get(`/auth/${verifiedToken.id}`);
        console.log(user.data);
        setUser(user.data);
        setAuthorized(true);
      }
    }
  }

  async function verifyToken(token: string) {
    const result = await api.post("auth/verify", {
      token,
    });
    if (result.data.message === "Token válido") {
      return result.data.data;
    } else {
      localStorage.removeItem("token");
      return undefined;
    }
  }

  async function login({
    matricula,
    dataDeNascimento,
  }: {
    matricula: string;
    dataDeNascimento: string;
  }) {
    setAuthorized(undefined);
    if (matricula && dataDeNascimento) {
      try {
        const user = await api.post("/auth", {
          matricula,
          dataDeNascimento,
        });
        console.log(user.data);
        localStorage.setItem("token", JSON.stringify(user.data.token));
        setUser(user.data.user);
        setAuthorized(true);
      } catch (error) {
        setAuthorized(false);
        // alert("Usuario não validado");
      }
    }
  }

  async function logout() {
    localStorage.removeItem("token");
    setAuthorized(false);
    setUser(undefined);
  }

  return (
    <AuthContext.Provider value={{ logout, authorized, login, user }}>
      {children}
    </AuthContext.Provider>
  );
}
