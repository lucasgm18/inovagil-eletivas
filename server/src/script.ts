import * as fs from "fs";
import { parse } from "csv-parse";
import { prisma } from "./lib/prisma";

const alunos = [];

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
    alunos.push(row);
  })
  .on("error", function (error) {
    console.log(error.message);
  })
  .on("end", function () {
    // Here log the result array
    console.log("parsed csv data:");
    console.log(alunos);
  });

alunos.map((aluno) => {
  createAluno(aluno);
});

async function createAluno(aluno: {
  nome: string;
  dataDeNascimento: Date;
  matricula: number;
  curso: string;
  serie: number;
}) {
  await prisma.students.create({
    data: {
      nome: aluno.nome,
      dataDeNascimento: aluno.dataDeNascimento,
      matricula: aluno.matricula,
      curso: aluno.curso,
      serie: aluno.serie,
    },
  });
}
