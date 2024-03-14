import { useContext } from "react";
import { AdminContext, AdminContextProps } from "../context/admin";

export function useAdmin(): AdminContextProps {
  const context = useContext(AdminContext);
  return context;
}
