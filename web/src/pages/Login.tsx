import Input from "../components/Input";
import Logo from "../assets/logo.png";
import { FormEvent, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

function Login() {
  const [matricula, setMatricula] = useState("");
  const [dataDeNascimento, setDataDeNascimento] = useState("");
  const { login, authorized } = useAuth();
  const navigation = useNavigate()
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    login({ matricula, dataDeNascimento });
  }
  return (
    <div className="w-full bg-slate-900 flex-col flex items-center justify-start flex-1 min-h-screen text-zinc-50 pb-12">
      <img src={Logo} className="size-48" alt="" />
      <div className="flex items-center flex-col justify-center text-center space-y-6 md:space-y-2 my-2 pb-4">
        <h1 className="text-3xl md:text-4xl font-bold">Bem vindo(a)</h1>
        <span className="text-xl">
          Faça login para ter acesso a todas as funcionalidades
        </span>
      </div>
      <div className="flex flex-col gap-2 items-center justify-center w-full">
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
              onChange={(e) => setDataDeNascimento(e.target.value)}
              type="text"
              label="Digite sua data de nascimento"
              placeholder="Ex: 03/02/2005"
            />
          </div>
          <div className="w-full flex items-center justify-center">
            <button className="bg-blue-800 px-4 py-2 rounded hover:bg-blue-700 hover:cursor-pointer hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 outline-none focus-visible:ring-lime-400">
              Login
            </button>
          </div>

          <div
            className={clsx({
              hidden: authorized === undefined,
              visible: authorized === false,
            })}
          >
            <p className="text-red-500 text-sm">Usuário não validado</p>
          </div>
        </form>

        <div>
          <button onClick={()=>{navigation("/admin")}} className="text-sm hover:underline">Admin</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
