import { ReactNode, createContext, useState } from "react";
import { api } from "../lib/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";

export interface AdminContextProps {
  truncateDatabase: ({ secret }: { secret: string }) => void;
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
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);
      try {
        await api.post("/students", {
          data,
          secret,
        });
        toast.success("Base de alunos cadastrada com sucesso");
        setIsLoading(false);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response) {
            toast.error(error.response.data.message);
            setIsLoading(false);
          }
        }
      }
    }
  }

  async function truncateDatabase({ secret }: { secret: string }) {
    if (secret) {
      setIsLoading(true);
      try {
        const response = await api.post("/export/trucate", {
          secret,
        });
        setIsLoading(false);
        return toast.success(response.data.message);
      } catch (error) {
        if (error instanceof AxiosError) {
          setIsLoading(false);
          return toast.error(error.response?.data.message);
        }
      }
    }
  }
  return (
    <AdminContext.Provider
      value={{ registerStudents, truncateDatabase, isLoading }}
    >
      {children}
    </AdminContext.Provider>
  );
}
