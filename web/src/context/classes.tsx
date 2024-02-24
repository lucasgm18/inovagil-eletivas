import { ReactNode, createContext, useState } from "react";
import { api } from "../lib/axios";
import { AxiosResponse } from "axios";

export interface ClassesContextProps {
  getClassesBySerie: ({ serie }: { serie: string }) => void;
  classes: ClassesProps[];
}

export interface ClassesProps {
  id: string;
  nome: string;
  professor: string;
  serie: string;
}

export const ClassesContext = createContext({} as ClassesContextProps);

export function ClassesContextProvider({ children }: { children: ReactNode }) {
  const [classes, setClasses] = useState<ClassesProps[]>([]);
  async function getClassesBySerie({ serie }: { serie: string }) {
    const {data}: AxiosResponse<ClassesProps> = await api.get(
      `/class/${serie}`
    );

    setClasses(data);
  }
  return (
    <ClassesContext.Provider value={{ getClassesBySerie, classes }}>
      {children}
    </ClassesContext.Provider>
  );
}
