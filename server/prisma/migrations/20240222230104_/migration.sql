-- CreateTable
CREATE TABLE "Classes" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "professor" TEXT NOT NULL,
    "serie" TEXT NOT NULL,

    CONSTRAINT "Classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Students" (
    "matricula" TEXT NOT NULL,
    "dataDeNascimento" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "serie" TEXT NOT NULL,
    "curso" TEXT NOT NULL,
    "classesId" TEXT NOT NULL,

    CONSTRAINT "Students_pkey" PRIMARY KEY ("matricula")
);

-- AddForeignKey
ALTER TABLE "Students" ADD CONSTRAINT "Students_classesId_fkey" FOREIGN KEY ("classesId") REFERENCES "Classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
