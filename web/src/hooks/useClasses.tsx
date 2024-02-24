import { useContext } from "react";
import { ClassesContext, ClassesContextProps } from "../context/classes";

export function useClasses(): ClassesContextProps {
  const context = useContext(ClassesContext);

  return context;
}
