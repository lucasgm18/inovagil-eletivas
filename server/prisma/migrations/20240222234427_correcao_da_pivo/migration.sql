/*
  Warnings:

  - You are about to drop the column `alunosMatriculadosId` on the `Students` table. All the data in the column will be lost.
  - Added the required column `studentId` to the `alunosMatriculados` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Students" DROP CONSTRAINT "Students_alunosMatriculadosId_fkey";

-- AlterTable
ALTER TABLE "Students" DROP COLUMN "alunosMatriculadosId";

-- AlterTable
ALTER TABLE "alunosMatriculados" ADD COLUMN     "studentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "alunosMatriculados" ADD CONSTRAINT "alunosMatriculados_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Students"("matricula") ON DELETE RESTRICT ON UPDATE CASCADE;
