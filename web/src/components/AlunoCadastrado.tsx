import { useClasses } from "../hooks/useClasses";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function AlunoCadastrado() {
  const { turmaCadastrada } = useClasses();

  if (turmaCadastrada.length <= 0) {
    return <p>loading</p>;
  }
  console.log(turmaCadastrada);
  return (
    <div className="flex w-full items-center justify-center">
      <span>
        Você já está cadastrado na turma{" "}
        <span className="text-yellow-500">
          {turmaCadastrada
            .map((turma) => {
              return turma.nome;
            })
            .join(" e ")}
        </span>
        , caso deseje trocar sua matrícula, basta selecionar uma outra
        disciplina
      </span>
    </div>
  );
}

export default AlunoCadastrado;
