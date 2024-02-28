-- CreateEnum
CREATE TYPE "DiaDaSemana" AS ENUM ('TERCA', 'QUINTA');

-- CreateTable
CREATE TABLE "Classes" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "professor" TEXT NOT NULL,
    "serie" TEXT NOT NULL,
    "quantidadeDeAlunos" INTEGER NOT NULL DEFAULT 0,
    "diaDaSemana" "DiaDaSemana" NOT NULL DEFAULT 'TERCA',

    CONSTRAINT "Classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alunosMatriculados" (
    "id" TEXT NOT NULL,
    "classesId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "alunosMatriculados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Students" (
    "matricula" TEXT NOT NULL,
    "dataDeNascimento" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "serie" TEXT NOT NULL,
    "curso" TEXT NOT NULL,

    CONSTRAINT "Students_pkey" PRIMARY KEY ("matricula")
);

-- AddForeignKey
ALTER TABLE "alunosMatriculados" ADD CONSTRAINT "alunosMatriculados_classesId_fkey" FOREIGN KEY ("classesId") REFERENCES "Classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alunosMatriculados" ADD CONSTRAINT "alunosMatriculados_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Students"("matricula") ON DELETE RESTRICT ON UPDATE CASCADE;
