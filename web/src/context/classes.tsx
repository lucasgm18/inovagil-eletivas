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
  getRegisteredClass: (classId: string[]) => void;
  classes: ClassesProps[];
  turmaCadastrada: ClassesProps[];
}

export interface ClassesProps {
  id: string;
  nome: string;
  professor: string;
  serie: string;
  quantidadeDeAlunos: number;
  diaDaSemana: "TERCA" | "QUINTA";
}

export const ClassesContext = createContext({} as ClassesContextProps);

export function ClassesContextProvider({ children }: { children: ReactNode }) {
  const [classes, setClasses] = useState<ClassesProps[]>([]);
  const [turmaCadastrada, setTurmaCadastrada] = useState<ClassesProps[]>([]);
  async function getClassesBySerie({ serie }: { serie: string }) {
    setClasses([]);
    const { data }: AxiosResponse = await api.get(`/class/${serie}`);
    setClasses(data);
  }

  async function getRegisteredClass(classId: string[]) {
    setTurmaCadastrada([]);
    const ids = classId;

    ids.map(async (id) => {
      const { data } = await api.get(`/class/turma/${id}`);
      setTurmaCadastrada((prev) => [...prev, data]);
    });
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
      value={{
        getClassesBySerie,
        registerClasses,
        getRegisteredClass,
        classes,
        turmaCadastrada,
      }}
    >
      {children}
    </ClassesContext.Provider>
  );
}
