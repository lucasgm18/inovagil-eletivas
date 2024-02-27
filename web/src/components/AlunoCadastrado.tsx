import { UserProps } from "../context/auth";
import { useClasses } from "../hooks/useClasses";

function AlunoCadastrado({ user }: { user: UserProps }) {
  const { turmaCadastrada } = useClasses();

  if (turmaCadastrada.length <= 0) {
    return <p>loading</p>;
  }
  console.log(turmaCadastrada);
  return (
    <div className="flex w-full items-center justify-center">
      <span>
        Você já está cadastrado na turma{" "}
        {turmaCadastrada
          .map((turma) => {
            return turma.nome;
          })
          .join(" e ")}
        , caso deseje trocar sua matrícula, basta selecionar uma outra
        disciplina
      </span>
    </div>
  );
}

export default AlunoCadastrado;
