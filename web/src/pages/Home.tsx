import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useClasses } from "../hooks/useClasses";
import TurmaCard from "../components/TurmaCard";

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
  console.log(eletivaMatriculada);
  return (
    <div className="min-h-screen bg-slate-900 text-zinc-50 pt-12 px-4">
      <div>
        <div className="flex flex-col w-full items-center justify-center">
          <span>Bem vindo(a)</span>
          <span>{user.nome}</span>
        </div>
        <div className="text-justify w-full">
          {eletivaMatriculada.length > 0 ? (
            <div>
              <span>
                Você já está cadastrado na turma{" "}
                {eletivaMatriculada[0].classesId}, caso deseje trocar sua
                matrícula, basta selecionar uma outra disciplina
              </span>
            </div>
          ) : (
            <p>
              Como você é do {user.serie} ano, você pode selecionar uma dentre
              essas eletivas
            </p>
          )}
        </div>
      </div>
      <div className="mt-12 w-full grid grid-cols-2 gap-4 place-content-center m-0 p-0">
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
