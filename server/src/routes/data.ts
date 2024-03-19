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
              const aluno = await prisma.users.findUnique({
                where: {
                  matricula: matricula.studentId,
                },
              });
              if (aluno) {
                // return aluno.matricula;
                return { nome: aluno.nome, matricula: aluno.matricula };
              }
            })
          );
          return {
            turma: turma.nome,
            professor: turma.professor,
            quantidade: turma.alunosMatriculados.length,
            alunos,
          };
        })
      );

      return reply.status(200).send(classes);
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
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    const paramsSchema = z.object({
      ano: z.string(),
    });
    const { ano } = paramsSchema.parse(req.params);
    const filePath = join(__dirname, "..", "public", "test.xlsx");
    res.header(
      "Content-Disposition",
      `attachment; filename=eletivas-${ano}-ano`
    );
    res.type(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.download("test.xlsx", `eletivas-${ano}-ano.xlsx`);
  });

  app.post("/trucate", async (req, res) => {
    const bodySchema = z.object({
      secret: z.string().min(1, "O segredo deve ser fornecido"),
    });

    const { secret } = bodySchema.parse(req.body);

    if (secret !== "Admin-ETE-Gil-Rodrigues-CdT") {
      return res.status(400).send({ message: "Código admin inválido" });
    }
    try {
      await prisma.alunosMatriculados.deleteMany();
      await prisma.classes.deleteMany();
      await prisma.users.deleteMany();

      res.status(200).send({ message: "Base de dados excluída com sucesso" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send({ message: error.message });
      }
    }
  });
}
