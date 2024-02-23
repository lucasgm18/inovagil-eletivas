/*
  Warnings:

  - You are about to drop the column `classesId` on the `Students` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Students" DROP CONSTRAINT "Students_classesId_fkey";

-- AlterTable
ALTER TABLE "Students" DROP COLUMN "classesId",
ADD COLUMN     "alunosMatriculadosId" TEXT;

-- CreateTable
CREATE TABLE "alunosMatriculados" (
    "id" TEXT NOT NULL,
    "classesId" TEXT NOT NULL,

    CONSTRAINT "alunosMatriculados_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "alunosMatriculados" ADD CONSTRAINT "alunosMatriculados_classesId_fkey" FOREIGN KEY ("classesId") REFERENCES "Classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Students" ADD CONSTRAINT "Students_alunosMatriculadosId_fkey" FOREIGN KEY ("alunosMatriculadosId") REFERENCES "alunosMatriculados"("id") ON DELETE SET NULL ON UPDATE CASCADE;
