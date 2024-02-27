import { ReactNode, createContext, useState } from "react";
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

export const AuthContext = createContext({} as AuthContextProps);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProps>();
  const [authorized, setAuthorized] = useState<boolean | undefined>();
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
        setUser(user.data);
        setAuthorized(true);
      } catch (error) {
        setAuthorized(false);
        // alert("Usuario não validado");
      }
    }
  }

  return (
    <AuthContext.Provider value={{ authorized, login, user }}>
      {children}
    </AuthContext.Provider>
  );
}
