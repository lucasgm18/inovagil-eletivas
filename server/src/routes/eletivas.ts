import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function EletivasRoutes(app: FastifyInstance) {
  app.get("/:serie", async (req, res) => {
    const paramsSchema = z.object({
      serie: z.string(),
    });
    const { serie } = paramsSchema.parse(req.params);
    console.log("serie", serie);
    const classes = await prisma.classes.findMany({
      where: {
        serie,
      },
    });
    res.status(200).send(classes);
  });

  app.post("/", async (req, res) => {
    const bodySchema = z.object({
      matricula: z.string(),
      classId: z.string().cuid(),
    });

    const { matricula, classId } = bodySchema.parse(req.body);
    console.log("matricula", matricula, "classId", classId);
    const user = await prisma.students.findUnique({
      where: {
        matricula,
      },
    });
    const turma = await prisma.classes.findUnique({
      where: {
        id: classId,
      },
    });
    const pivo = await prisma.alunosMatriculados.findUnique({
      where: {
        studentId: matricula,
      },
    });

    if (pivo) {
      if (pivo.classesId === classId) {
        res.status(500).send("Usuário já cadastrado");
      }

      await prisma.alunosMatriculados.delete({
        where: {
          id: pivo.id,
        },
      });

      const novaMatricula = await prisma.alunosMatriculados.create({
        data: {
          studentId: user.matricula,
          classesId: classId,
        },
      });
      res.status(200).send(`usuário cadastrado em: ${novaMatricula}`);
    }
    const novaMatricula = await prisma.alunosMatriculados.create({
      data: {
        studentId: user.matricula,
        classesId: classId,
      },
    });
    res.status(200).send(`usuário cadastrado em: ${novaMatricula}`);
  });
}
