/*
  Warnings:

  - A unique constraint covering the columns `[studentId]` on the table `alunosMatriculados` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "alunosMatriculados_studentId_key" ON "alunosMatriculados"("studentId");
