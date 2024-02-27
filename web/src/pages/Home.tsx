import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useClasses } from "../hooks/useClasses";
import TurmaCard from "../components/TurmaCard";
import AlunoCadastrado from "../components/AlunoCadastrado";

function Home() {
  const { user } = useAuth();
  const { getClassesBySerie, classes } = useClasses();

  useEffect(() => {
    getClassesBySerie({ serie: user!.serie });
  }, []);

  if (!user) {
    return <div>loading</div>;
  }

  const eletivaMatriculada = user.turmasCadastradas.filter((turma) => {
    return turma.studentId === user.matricula;
  });
  return (
    <div className="min-h-screen bg-slate-900 text-zinc-50 pt-12 px-4">
      <div>
        <div className="flex flex-col w-full items-center justify-center">
          <span>Bem vindo(a)</span>
          <span>{user.nome}</span>
        </div>
        <div className="text-center w-full">
          {eletivaMatriculada.length > 0 ? (
            <AlunoCadastrado user={user} />
          ) : (
            <p>
              Como você é do {user.serie} ano, você pode selecionar uma dentre
              essas eletivas
            </p>
          )}
        </div>
      </div>
      <div className="mt-12 w-full flex flex-col space-y-2 md:space-y-0 md:grid md:grid-cols-2 md:gap-4 md:place-content-center m-0 p-0">
        {classes
          .sort((a, b) => (a.nome > b.nome ? 1 : b.nome > a.nome ? -1 : 0))
          .map((turma) => {
            return <TurmaCard turma={turma} key={turma.id} />;
          })}
      </div>
    </div>
  );
}

export default Home;
