import { ReactNode } from "react";
import { AuthContextProvider } from "../context/auth";
import { ClassesContextProvider } from "../context/classes";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContextProvider>
      <ClassesContextProvider>{children}</ClassesContextProvider>
    </AuthContextProvider>
  );
}
