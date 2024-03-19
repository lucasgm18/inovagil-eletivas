/*
  Warnings:

  - You are about to drop the `Students` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADM', 'USER');

-- DropForeignKey
ALTER TABLE "alunosMatriculados" DROP CONSTRAINT "alunosMatriculados_studentId_fkey";

-- DropTable
DROP TABLE "Students";

-- CreateTable
CREATE TABLE "Users" (
    "matricula" TEXT NOT NULL,
    "dataDeNascimento" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "serie" TEXT NOT NULL,
    "curso" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',

    CONSTRAINT "Users_pkey" PRIMARY KEY ("matricula")
);

-- AddForeignKey
ALTER TABLE "alunosMatriculados" ADD CONSTRAINT "alunosMatriculados_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Users"("matricula") ON DELETE RESTRICT ON UPDATE CASCADE;
