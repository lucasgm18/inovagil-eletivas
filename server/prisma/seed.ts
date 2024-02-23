import { prisma } from "../src/lib/prisma";

async function main() {
  await prisma.classes.createMany({
    data: [
      {
        nome: "Eletiva 1",
        professor: "Professor 1",
      
        serie: "1",
      },
      {
        nome: "Eletiva 2",
        professor: "Professor 2",
        serie: "1",
      
      },
      {
        nome: "Eletiva 3",
        professor: "Professor 3",
        serie: "1",
      
      },
      {
        nome: "Eletiva 4",
        professor: "Professor 4",
        serie: "1",
      
      },
      {
        nome: "Eletiva 1",
        professor: "Professor 1",
        serie: "2",
      
      },
      {
        nome: "Eletiva 2",
        professor: "Professor 3",
        serie: "2",
      
      },
      {
        nome: "Eletiva 3",
        professor: "Professor 3",
        serie: "2",
      
      },
      {
        nome: "Eletiva 4",
        professor: "Professor 4",
        serie: "2",
      
      },
      {
        nome: "Eletiva 1",
        professor: "Professor 1",
        serie: "3",
      
      },
      {
        nome: "Eletiva 2",
        professor: "Professor 3",
        serie: "3",
      
      },
      {
        nome: "Eletiva 3",
        professor: "Professor 3",
        serie: "3",
      
      },
      {
        nome: "Eletiva 4",
        professor: "Professor 4",
        serie: "3",
      
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
