import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { fastifyStatic } from "@fastify/static";
import { join } from "path";
import { createObjectCsvWriter } from "csv-writer";
import * as fs from "fs";

export async function ExportData(app: FastifyInstance) {
  app.register(fastifyStatic, {
    root: join(__dirname, "..", "..", "public"),
    prefix: "/",
  });

  app.post("/", async (request, reply) => {
    const bodySchema = z.object({
      ano: z.string(),
      secret: z.string(),
    });

    const { ano, secret } = bodySchema.parse(request.body);

    if (secret !== "Admin-ETE-Gil-Rodrigues-CdT") {
      return reply.status(401).send("Usuário não autenticado");
    }
    const turmas = await prisma.classes.findMany({
      where: {
        serie: ano,
      },
      include: { alunosMatriculados: true },
    });

    if (turmas) {
      const classes = await Promise.all(
        turmas.map(async (turma) => {
          const alunos = await Promise.all(
            turma.alunosMatriculados.map(async (matricula) => {
              const aluno = await prisma.students.findUnique({
                where: {
                  matricula: matricula.studentId,
                },
              });
              if (aluno) {
                return aluno.matricula;
                // return { nome: aluno.nome, matricula: aluno.matricula };
              }
            })
          );
          return {
            turma: turma.nome,
            professor: turma.professor,
            quantidade: turma.quantidadeDeAlunos,
            alunos,
          };
        })
      );

      // convertToCsv(classes);
      const csvFilePath = join(__dirname, "..", "..", "public", "export.csv");
      const csvWriter = createObjectCsvWriter({
        path: csvFilePath,
        fieldDelimiter: ",",
        header: [
          { id: "turma", title: "Turma" },
          { id: "professor", title: "Professor" },
          { id: "quantidade", title: "Quantidade de Alunos" },
          { id: "alunos", title: "Alunos" },
        ],
      });

      try {
        csvWriter.writeRecords(classes);
        if (fs.existsSync(csvFilePath)) {
          const url = `http://localhost:3333/export/download/${ano}`;
          console.log(url);
          return reply.status(200).send(url);
        }
        // return reply.status(200).send(`export/download/${ano}`);
      } catch (error) {
        console.error("Erro ao escrever no arquivo CSV:", error);
        return reply.status(500).send("Erro ao escrever no arquivo CSV");
      }
    }
  });

  // function convertToCsv(arr) {
  //   const array = [Object.keys(arr[0])].concat(arr);

  //   return array
  //     .map((item) => {
  //       return Object.values(item);
  //     })
  //     .join("\n");
  // }

  app.get("/download/:ano", async (req, res) => {
    const paramsSchema = z.object({
      ano: z.string(),
    });
    const { ano } = paramsSchema.parse(req.params);
    const filePath = join(__dirname, "..", "..", "public", "export.csv");
    res.header(
      "Content-Disposition",
      `attachment; filename=eletivas-${ano}-ano`
    );
    res.type("text/csv");
    res.download("export.csv", `eletivas-${ano}-ano.csv`);
  });
}
