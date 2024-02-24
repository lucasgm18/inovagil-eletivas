import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useClasses } from "../hooks/useClasses";

function Home() {
  const { user } = useAuth();
  const { getClassesBySerie, classes } = useClasses();

  useEffect(() => {
    getClassesBySerie({ serie: user!.serie });
  }, []);
  return (
    <div className="min-h-screen bg-slate-900 text-zinc-50 pt-4 px-4">
      <div>
        <div className="flex flex-col w-full items-center justify-center">
          <span>Bem vindo(a)</span>
          <span>{user?.nome}</span>
        </div>
        <div className="text-justify w-full">
          <p>
            Como você é do {user?.serie} ano, você pode selecionar dentre essas
            eletivas
          </p>
        </div>
      </div>
      <div className="bg-zinc-400 w-full">
        {classes.map((turma) => {
          return (
            <div>
              <span>{turma.nome}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
