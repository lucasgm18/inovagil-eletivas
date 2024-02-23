-- DropForeignKey
ALTER TABLE "Students" DROP CONSTRAINT "Students_classesId_fkey";

-- AlterTable
ALTER TABLE "Students" ALTER COLUMN "classesId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Students" ADD CONSTRAINT "Students_classesId_fkey" FOREIGN KEY ("classesId") REFERENCES "Classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
