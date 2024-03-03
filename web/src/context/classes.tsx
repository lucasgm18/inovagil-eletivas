import { ReactNode, createContext, useState } from "react";
import { api } from "../lib/axios";
import { AxiosError, AxiosResponse } from "axios";

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
  exportData: (ano: string, secret: string) => void;
  classes: ClassesProps[];
  turmaCadastrada: ClassesProps[];
  csvData: {
    turma: string;
    alunos: string[];
    professor: string;
    quantidade: number;
  }[];
  visible: boolean | undefined;
}

export interface ClassesProps {
  id: string;
  nome: string;
  professor: string;
  serie: string;
  quantidadeDeAlunos: number;
  diaDaSemana: "TERCA" | "QUINTA";
  alunosMatriculados: {
    id: string;
    classesId: string;
    studentId: string;
  }[];
}

export const ClassesContext = createContext({} as ClassesContextProps);

export function ClassesContextProvider({ children }: { children: ReactNode }) {
  const [classes, setClasses] = useState<ClassesProps[]>([]);
  const [visible, setVisible] = useState<boolean | undefined>(undefined);
  const [turmaCadastrada, setTurmaCadastrada] = useState<ClassesProps[]>([]);
  const [csvData, setCsvData] = useState<
    {
      turma: string;
      alunos: string[];
      professor: string;
      quantidade: number;
    }[]
  >([]);
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
      try {
        const { data } = await api.post("/class", {
          matricula,
          classId,
        });
        alert(data);
        location.reload();
      } catch (error) {
        if (error && error instanceof AxiosError) {
          alert(error.response!.data);
          location.reload();
        }
      }
    }
  }

  async function exportData(ano: string, secret: string) {
    setVisible(undefined);
    try {
      const data = await api.post("/export", {
        ano,
        secret,
      });
      setVisible(false);
      setCsvData(data.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          setVisible(true);
        }
      }
    }
  }

  return (
    <ClassesContext.Provider
      value={{
        csvData,
        visible,
        getClassesBySerie,
        registerClasses,
        getRegisteredClass,
        classes,
        turmaCadastrada,
        exportData,
      }}
    >
      {children}
    </ClassesContext.Provider>
  );
}
