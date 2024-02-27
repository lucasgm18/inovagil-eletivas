import React, { useEffect } from "react";
import { UserProps } from "../context/auth";
import { useClasses } from "../hooks/useClasses";

function AlunoCadastrado({ user }: { user: UserProps }) {
  const { getRegisteredClass, turmaCadastrada } = useClasses();
  const eletivaMatriculada = user.turmasCadastradas.filter((turma) => {
    return turma.studentId === user.matricula;
  });

  useEffect(() => {
    getRegisteredClass(eletivaMatriculada[0].classesId);
  }, []);

  if (!turmaCadastrada) {
    return <p>loading</p>;
  }

  return (
    <div className="flex w-full items-center justify-center">
      <span>
        Você já está cadastrado na turma {turmaCadastrada[0].nome}, caso deseje
        trocar sua matrícula, basta selecionar uma outra disciplina
      </span>
    </div>
  );
}

export default AlunoCadastrado;
