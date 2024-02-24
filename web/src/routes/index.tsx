import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import { useAuth } from "../hooks/useAuth";

export function AppRouter() {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user !== undefined ? <Home /> : <Login />} />
      </Routes>
    </BrowserRouter>
  );
}
