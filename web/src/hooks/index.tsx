import { ReactNode } from "react";
import { AuthContextProvider } from "../context/auth";
import { ClassesContextProvider } from "../context/classes";
import { AdminContextProvider } from "../context/admin";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContextProvider>
      <AdminContextProvider>
        <ClassesContextProvider>{children}</ClassesContextProvider>
      </AdminContextProvider>
    </AuthContextProvider>
  );
}
