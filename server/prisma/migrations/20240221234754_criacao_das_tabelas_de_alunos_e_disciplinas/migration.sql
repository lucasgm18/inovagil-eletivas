-- CreateTable
CREATE TABLE "Classes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "teacher" TEXT NOT NULL,
    "amountOfStudents" INTEGER NOT NULL,

    CONSTRAINT "Classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Students" (
    "matricula" INTEGER NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "serie" INTEGER NOT NULL,

    CONSTRAINT "Students_pkey" PRIMARY KEY ("matricula")
);
