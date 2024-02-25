import { ReactNode, createContext, useState } from "react";
import { api } from "../lib/axios";
import { AxiosResponse } from "axios";

export interface ClassesContextProps {
  getClassesBySerie: ({ serie }: { serie: string }) => void;
  registerClasses: ({
    matricula,
    classId,
  }: {
    matricula: string;
    classId: string;
  }) => void;
  classes: ClassesProps[];
  count: { classId: string; count: number }[];
}

export interface ClassesProps {
  id: string;
  nome: string;
  professor: string;
  serie: string;
  quantidadeDeAlunos: number;
}

export const ClassesContext = createContext({} as ClassesContextProps);

export function ClassesContextProvider({ children }: { children: ReactNode }) {
  const [classes, setClasses] = useState<ClassesProps[]>([]);
  const [count, setCount] = useState<{ classId: string; count: number }[]>([]);
  async function getClassesBySerie({ serie }: { serie: string }) {
    setClasses([]);
    setCount([]);
    const { data }: AxiosResponse = await api.get(`/class/${serie}`);
    setClasses(data);
  }

  async function registerClasses({
    matricula,
    classId,
  }: {
    matricula: string;
    classId: string;
  }) {
    if (matricula && classId) {
      await api.post("/class", {
        matricula,
        classId,
      });
    }
  }
  return (
    <ClassesContext.Provider
      value={{ getClassesBySerie, registerClasses, classes, count }}
    >
      {children}
    </ClassesContext.Provider>
  );
}
