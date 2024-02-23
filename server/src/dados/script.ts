import * as fs from "fs";
import { parse } from "csv-parse";

export const alunos = readCsvFile();

function readCsvFile() {
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

  return alunos;
}
