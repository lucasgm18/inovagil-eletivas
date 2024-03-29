import { prisma } from "../src/lib/prisma";
import * as fs from "fs";
import { parse } from "csv-parse";

async function main() {
  const data = [];

  fs.createReadStream("./src/dados/alunos.csv")
    .pipe(
      parse({
        delimiter: ",",
        columns: true,
        ltrim: true,
      })
    )
    .on("data", function (row) {
      // This will push the object row into the array
      data.push(row);
    })
    .on("error", function (error) {
      console.log(error.message);
    })
    .on("end", async function () {
      // await prisma.alunosMatriculados.deleteMany();
      // console.log("Pivot deleted");
      // // await prisma.users.deleteMany();
      // console.log("Users deleted");
      // await prisma.classes.deleteMany();
      // console.log("Classes deleted");
      // await prisma.users.createMany({
      //   data,
      // });
      // console.log("users created");
      // await prisma.classes.createMany({
      //   data: [
      //     {
      //       nome: "Educação financeira",
      //       professor: "Paulo Herton",
      //       serie: "1",
      //       vagas: 45,
      //     },
      //     {
      //       nome: "Iniciação Científica",
      //       professor: "Daniel",
      //       serie: "1",
      //       vagas: 45,
      //     },
      //     {
      //       nome: "Esportes Alternativos",
      //       professor: "Diego",
      //       serie: "1",
      //       vagas: 45,
      //     },
      //     {
      //       nome: "Natureza na Prática",
      //       professor: "Fabíola",
      //       serie: "1",
      //       vagas: 45,
      //     },
      //     {
      //       nome: "BIOEMFOCO",
      //       professor: "Fabíola",
      //       serie: "2",
      //       diaDaSemana: "TERCA",
      //       vagas: 45,
      //     },
      //     {
      //       nome: "Histórias em Quadrinhos",
      //       professor: "Franci",
      //       serie: "2",
      //       diaDaSemana: "TERCA",
      //       vagas: 45,
      //     },
      //     {
      //       nome: "Historicidade da Cultura Corporal",
      //       professor: "Eli",
      //       serie: "2",
      //       diaDaSemana: "TERCA",
      //       vagas: 45,
      //     },
      //     {
      //       nome: "Morfologia Vegetal",
      //       professor: "Renato",
      //       serie: "2",
      //       diaDaSemana: "TERCA",
      //       vagas: 45,
      //     },
      //     {
      //       nome: "Natureza na Prática",
      //       professor: "Fabiola",
      //       serie: "2",
      //       diaDaSemana: "QUINTA",
      //       vagas: 45,
      //     },
      //     {
      //       nome: "Práticas de Laboratório",
      //       professor: "Renato",
      //       serie: "2",
      //       diaDaSemana: "QUINTA",
      //       vagas: 45,
      //     },
      //     {
      //       nome: "Iniciação aos Fundamentos do Basquete",
      //       professor: "Eli",
      //       serie: "2",
      //       diaDaSemana: "QUINTA",
      //       vagas: 45,
      //     },
      //     {
      //       nome: "PNL e as Técnicas de Vendas",
      //       professor: "Alex",
      //       serie: "2",
      //       diaDaSemana: "QUINTA",
      //       vagas: 45,
      //     },
      //     {
      //       nome: "Explorando Soluções Estratégicas",
      //       professor: "Magnun",
      //       serie: "3",
      //       vagas: 45,
      //     },
      //     {
      //       nome: "Resolução de Questões",
      //       professor: "Paulo",
      //       serie: "3",
      //       vagas: 45,
      //     },
      //     {
      //       nome: "Revendo a Física de Olho no Enem",
      //       professor: "Carlos",
      //       serie: "3",
      //       vagas: 45,
      //     },
      //     {
      //       nome: "Iniciação ao Futsal",
      //       professor: "Diego",
      //       serie: "3",
      //       vagas: 45,
      //     },
      //   ],
      // });
      // console.log("Classes created");
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
