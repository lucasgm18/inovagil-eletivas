import { ReactNode, createContext } from "react";
import { api } from "../lib/axios";

export interface AdminContextProps {
  registerStudents: (
    data:
      | {
          matricula: string;
          dataDeNascimento: string;
          nome: string;
          serie: string;
          curso: string;
        }[]
  ) => void;
}
export const AdminContext = createContext({} as AdminContextProps);

export function AdminContextProvider({ children }: { children: ReactNode }) {
  async function registerStudents(
    data:
      | {
          matricula: string;
          dataDeNascimento: string;
          nome: string;
          serie: string;
          curso: string;
        }[]
  ) {
    if (data) {
      await api.post("/students", {
        data: data,
      });
    }
  }
  return (
    <AdminContext.Provider value={{ registerStudents }}>
      {children}
    </AdminContext.Provider>
  );
}
