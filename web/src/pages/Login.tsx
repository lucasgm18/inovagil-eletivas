import Input from "../components/Input";
import Logo from "../assets/logo.png";
import { FormEvent, useState } from "react";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const [matricula, setMatricula] = useState("");
  const [dataDeNascimento, setDataDeNasciment] = useState("");
  const { login } = useAuth();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    login({ matricula, dataDeNascimento });
  }
  return (
    <div className="w-full bg-slate-900 flex-col flex items-center justify-start flex-1 min-h-screen text-zinc-50 pb-12">
      <img src={Logo} className="size-56" alt="" />
      <div className="flex items-center flex-col justify-center text-center space-y-2 mb-12">
        <h1 className="text-4xl font-bold">Bem vindo(a)</h1>
        <span className="text-xl">
          Faça login para ter acesso a todas as funcionalidades
        </span>
      </div>
      <div className="flex items-center justify-center w-full">
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-800 w-[80%] md:w-1/2 flex items-center justify-center flex-col space-y-8 py-8 rounded"
        >
          <div className="w-full space-y-4">
            <Input
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              type="text"
              label="Digite sua matricula"
              placeholder="Ex: 2335461"
            />
            <Input
              value={dataDeNascimento}
              onChange={(e) => setDataDeNasciment(e.target.value)}
              type="date"
              label="Escolha sua data de nascimento"
            />
          </div>
          <div className="w-full flex items-center justify-center">
            <button className="bg-blue-800 px-4 py-2 rounded hover:bg-blue-700 hover:cursor-pointer">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
