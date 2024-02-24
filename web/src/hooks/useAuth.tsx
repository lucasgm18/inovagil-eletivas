import { useContext } from "react";
import { AuthContext, AuthContextProps } from "../context/auth";

export function useAuth(): AuthContextProps {
  const context = useContext(AuthContext);
  return context;
}
