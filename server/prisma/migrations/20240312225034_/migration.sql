/*
  Warnings:

  - You are about to drop the column `quantidadeDeAlunos` on the `Classes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Classes" DROP COLUMN "quantidadeDeAlunos",
ADD COLUMN     "vagas" INTEGER NOT NULL DEFAULT 0;
