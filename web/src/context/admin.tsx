import { ReactNode, createContext } from "react";
import { api } from "../lib/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";

export interface AdminContextProps {
  registerStudents: ({
    data,
    secret,
  }: {
    data: {
      matricula: string;
      dataDeNascimento: string;
      nome: string;
      serie: string;
      curso: string;
    }[];
    secret: string;
  }) => void;
}

export interface StudentsProps {
  matricula: number;
  dataDeNascimento: string;
  nome: string;
  serie: number;
  curso: string;
}
export const AdminContext = createContext({} as AdminContextProps);

export function AdminContextProvider({ children }: { children: ReactNode }) {
  async function registerStudents({
    data,
    secret,
  }: {
    data: {
      matricula: string;
      dataDeNascimento: string;
      nome: string;
      serie: string;
      curso: string;
    }[];
    secret: string;
  }) {
    if (data) {
      try {
        await api.post("/students", {
          data,
          secret,
        });
        toast.success("Base de alunos cadastrada com sucesso");
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response) {
            toast.error(error.response.data.message);
          }
        }
      }
    }
  }
  return (
    <AdminContext.Provider value={{ registerStudents }}>
      {children}
    </AdminContext.Provider>
  );
}
