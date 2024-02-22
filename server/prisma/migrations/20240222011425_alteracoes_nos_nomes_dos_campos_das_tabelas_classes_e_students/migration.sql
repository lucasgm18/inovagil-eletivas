/*
  Warnings:

  - You are about to drop the column `amountOfStudents` on the `Classes` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Classes` table. All the data in the column will be lost.
  - You are about to drop the column `teacher` on the `Classes` table. All the data in the column will be lost.
  - You are about to drop the column `birthDate` on the `Students` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Students` table. All the data in the column will be lost.
  - Added the required column `nome` to the `Classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `professor` to the `Classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantidadeDeAlunosMatriculados` to the `Classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `curso` to the `Students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataDeNascimento` to the `Students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `Students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Classes" DROP COLUMN "amountOfStudents",
DROP COLUMN "name",
DROP COLUMN "teacher",
ADD COLUMN     "nome" TEXT NOT NULL,
ADD COLUMN     "professor" TEXT NOT NULL,
ADD COLUMN     "quantidadeDeAlunosMatriculados" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Students" DROP COLUMN "birthDate",
DROP COLUMN "name",
ADD COLUMN     "curso" TEXT NOT NULL,
ADD COLUMN     "dataDeNascimento" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "nome" TEXT NOT NULL;
