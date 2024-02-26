import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function EletivasRoutes(app: FastifyInstance) {
  app.get("/:serie", async (req, res) => {
    const paramsSchema = z.object({
      serie: z.string(),
    });
    const { serie } = paramsSchema.parse(req.params);
    const classes = await prisma.classes.findMany({
      where: {
        serie,
      },
    });
    res.status(200).send(classes);
  });

  // app.get("/:classId", async (req, res) => {
  //   const paramsSchema = z.object({
  //     classId: z.string(),
  //   });

  //   const { classId } = paramsSchema.parse(req.params);

  //   const turma = await prisma.classes.findUnique({
  //     where: {
  //       id: classId,
  //     },
  //   });

  //   if (!turma) {
  //     return res.status(500).send("Id da Turma inválido");
  //   }
  //   return res.status(200).send(turma);
  // });

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
    const pivo = await prisma.alunosMatriculados.findFirst({
      where: {
        studentId: user.matricula,
      },
    });

    if (pivo /*&& user.serie !== "2"*/) {
      if (pivo.classesId === turma.id) {
        res.status(500).send("Usuário já cadastrado na disciplina");
      }

      const classFromPivo = await prisma.classes.findFirst({
        where: {
          id: pivo.classesId,
        },
      });
      await prisma.classes.update({
        where: {
          id: pivo.classesId,
        },
        data: {
          quantidadeDeAlunos: classFromPivo.quantidadeDeAlunos - 1,
        },
      });

      await prisma.alunosMatriculados.delete({
        where: {
          id: pivo.id,
        },
      });
      console.log("deletou uma pivo");
      await prisma.classes.update({
        where: {
          id: classId,
        },
        data: {
          quantidadeDeAlunos: turma.quantidadeDeAlunos + 1,
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

    // if (user.serie === "2") {
    //   const turmas = await prisma.alunosMatriculados.findMany({
    //     where: {
    //       studentId: user.matricula,
    //     },
    //   });

    //   if (turmas.length >= 2) {
    //     await prisma.alunosMatriculados.delete({
    //       where: {
    //         id: turmas[0].id,
    //       },
    //     });

    //     const novaMatricula = await prisma.alunosMatriculados.create({
    //       data: {
    //         classesId: turma.id,
    //         studentId: user.matricula,
    //       },
    //     });

    //     return res.status(200).send(`Nova matricula em ${novaMatricula.id}`);
    //   }
    // }
    const atualizarTabela = await prisma.classes.update({
      where: {
        id: classId,
      },
      data: {
        quantidadeDeAlunos: turma.quantidadeDeAlunos + 1,
      },
    });
    const novaMatricula = await prisma.alunosMatriculados.create({
      data: {
        studentId: user.matricula,
        classesId: classId,
      },
    });
    res.status(200).send(`usuário cadastrado em: ${novaMatricula}`);
  });
}
