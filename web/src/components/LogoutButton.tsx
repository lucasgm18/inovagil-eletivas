import React from "react";
import { useAuth } from "../hooks/useAuth";

function LogoutButton() {
  const { logout } = useAuth();
  return (
    <div className="w-full flex items-center justify-center pb-12">
      <button
        onClick={logout}
        className="py-2 px-6 bg-red-500 rounded hover:bg-red-600 focus-visible:ring-2 focus-visible:ring-white outline-none"
      >
        Sair
      </button>
    </div>
  );
}

export default LogoutButton;
