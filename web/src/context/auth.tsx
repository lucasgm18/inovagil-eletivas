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
  async function login({
    matricula,
    dataDeNascimento,
  }: {
    matricula: string;
    dataDeNascimento: string;
  }) {
    if (matricula && dataDeNascimento) {
      const user = await api.post("/auth", {
        matricula,
        dataDeNascimento,
      });

      console.log(user.data);
      setUser(user.data);
    }
  }

  return (
    <AuthContext.Provider value={{ login, user }}>
      {children}
    </AuthContext.Provider>
  );
}
