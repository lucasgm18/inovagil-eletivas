import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import { useAuth } from "../hooks/useAuth";
import Admin from "../pages/Admin";
import Data from "../pages/Data";

export function AppRouter() {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user !== undefined ? <Home /> : <Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/data" element={<Data />} />
      </Routes>
    </BrowserRouter>
  );
}
