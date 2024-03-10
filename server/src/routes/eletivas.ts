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
    return res.status(200).send(classes);
  });

  app.get("/turma/:classId", async (req, res) => {
    const paramsSchema = z.object({
      classId: z.string(),
    });

    const { classId } = paramsSchema.parse(req.params);

    const turma = await prisma.classes.findUnique({
      where: {
        id: classId,
      },
      include: {
        alunosMatriculados: true,
      },
    });

    if (!turma) {
      return res.status(400).send("Id da Turma inválido");
    }
    return res.status(200).send(turma);
  });

  app.post("/", async (req, res) => {
    const bodySchema = z.object({
      matricula: z.string(),
      classId: z.string().cuid(),
    });

    const { matricula, classId } = bodySchema.parse(req.body);

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

    const pivo = await prisma.alunosMatriculados.findMany({
      where: {
        studentId: user.matricula,
      },
    });

    if (user.serie === "2") {
      if (pivo.length === 1) {
        const classFromPivo = await prisma.classes.findUnique({
          where: {
            id: pivo[0].classesId,
          },
        });
        if (pivo[0].classesId === classId) {
          return res.status(400).send("Usuário já cadastrado nessa disciplina");
        }

        if (classFromPivo.diaDaSemana === turma.diaDaSemana) {
          if (turma.quantidadeDeAlunos === 45) {
            return res.status(400).send("Não há vagas disponíveis");
          }
          await prisma.alunosMatriculados.delete({
            where: {
              id: pivo[0].id,
            },
          });

          await prisma.classes.update({
            where: {
              id: classFromPivo.id,
            },
            data: {
              quantidadeDeAlunos: classFromPivo.quantidadeDeAlunos - 1,
            },
          });

          const novaMatricula = await prisma.alunosMatriculados.create({
            data: {
              classesId: turma.id,
              studentId: user.matricula,
            },
          });

          await prisma.classes.update({
            where: {
              id: turma.id,
            },
            data: {
              quantidadeDeAlunos: turma.quantidadeDeAlunos + 1,
            },
          });

          return res.status(200).send("Cadastro relizado com sucesso!");
        }

        if (turma.quantidadeDeAlunos >= 45) {
          console.log("não cadastrou");
          return res.status(200).send(`As vagas dessa turma acabaram`);
        }

        const novaMatricula = await prisma.alunosMatriculados.create({
          data: {
            classesId: turma.id,
            studentId: user.matricula,
          },
        });
        await prisma.classes.update({
          where: {
            id: classId,
          },
          data: {
            quantidadeDeAlunos: turma.quantidadeDeAlunos + 1,
          },
        });
        console.log("Cadastrou a segunda");
        return res.status(200).send("Cadastro relizado com sucesso!");
      }
      if (pivo.length === 2) {
        if (pivo[0].classesId === turma.id || pivo[1].classesId === turma.id) {
          return res.status(400).send("Usuário já cadastrado nessa eletiva");
        }
        const firstClassFromPivo = await prisma.classes.findUnique({
          where: {
            id: pivo[0].classesId,
          },
        });
        const secondClassFromPivo = await prisma.classes.findUnique({
          where: {
            id: pivo[1].classesId,
          },
        });
        if (firstClassFromPivo.diaDaSemana === turma.diaDaSemana) {
          if (turma.quantidadeDeAlunos === 45) {
            return res.status(400).send("Não há vagas disponíveis");
          }
          await prisma.alunosMatriculados.delete({
            where: {
              id: pivo[0].id,
            },
          });

          await prisma.classes.update({
            where: {
              id: firstClassFromPivo.id,
            },
            data: {
              quantidadeDeAlunos: firstClassFromPivo.quantidadeDeAlunos - 1,
            },
          });

          const novaMatricula = await prisma.alunosMatriculados.create({
            data: {
              classesId: turma.id,
              studentId: user.matricula,
            },
          });

          await prisma.classes.update({
            where: {
              id: turma.id,
            },
            data: {
              quantidadeDeAlunos: turma.quantidadeDeAlunos + 1,
            },
          });
          return res
            .status(200)
            .send("Cadastro na nova turma, relizado com sucesso!");
        }
        if (secondClassFromPivo.diaDaSemana === turma.diaDaSemana) {
          if (turma.quantidadeDeAlunos === 45) {
            return res.status(400).send("Não há vagas disponíveis");
          }
          console.log("passou pelo limitador");
          await prisma.alunosMatriculados.delete({
            where: {
              id: pivo[1].id,
            },
          });

          await prisma.classes.update({
            where: {
              id: secondClassFromPivo.id,
            },
            data: {
              quantidadeDeAlunos: secondClassFromPivo.quantidadeDeAlunos - 1,
            },
          });

          const novaMatricula = await prisma.alunosMatriculados.create({
            data: {
              classesId: turma.id,
              studentId: user.matricula,
            },
          });

          await prisma.classes.update({
            where: {
              id: turma.id,
            },
            data: {
              quantidadeDeAlunos: turma.quantidadeDeAlunos + 1,
            },
          });
          return res
            .status(200)
            .send("Cadastro na nova turma, relizado com sucesso!");
        }

        if (turma.quantidadeDeAlunos === 45) {
          console.log("não tem vagas primeiro cadastro");
          return res.status(400).send("Não há vagas disponíveis");
        }

        await prisma.alunosMatriculados.delete({
          where: {
            id: pivo[0].id,
          },
        });

        await prisma.classes.update({
          where: {
            id: pivo[0].classesId,
          },
          data: {
            quantidadeDeAlunos: firstClassFromPivo.quantidadeDeAlunos - 1,
          },
        });

        const novaMatricula = await prisma.alunosMatriculados.create({
          data: {
            classesId: turma.id,
            studentId: user.matricula,
          },
        });

        await prisma.classes.update({
          where: {
            id: turma.id,
          },
          data: {
            quantidadeDeAlunos: turma.quantidadeDeAlunos + 1,
          },
        });
        console.log("Cadastrou a segunda, deletando a primeira");
        return res
          .status(200)
          .send("Cadastro na nova turma, relizado com sucesso!");
      }

      if (turma.quantidadeDeAlunos === 45) {
        console.log("não há vagas disponíveis");
        return res.status(400).send("Não há vagas disponíveis");
      }
      const novaMatricula = await prisma.alunosMatriculados.create({
        data: {
          classesId: turma.id,
          studentId: user.matricula,
        },
      });
      await prisma.classes.update({
        where: {
          id: classId,
        },
        data: {
          quantidadeDeAlunos: turma.quantidadeDeAlunos + 1,
        },
      });
      console.log("Cadastrou a primeira");
      return res.status(200).send("Cadastro relizado com sucesso!");
    }

    if (pivo.length !== 0) {
      if (pivo[0].classesId === turma.id) {
        console.log("caiu aq");
        return res.status(400).send("Usuário já cadastrado na disciplina");
      }

      if (turma.quantidadeDeAlunos === 45) {
        return res.status(400).send("Não há vagas disponíveis");
      }

      const classFromPivo = await prisma.classes.findUnique({
        where: {
          id: pivo[0].classesId,
        },
      });

      await prisma.alunosMatriculados.delete({
        where: {
          id: pivo[0].id,
        },
      });

      await prisma.classes.update({
        where: {
          id: classFromPivo.id,
        },
        data: {
          quantidadeDeAlunos: classFromPivo.quantidadeDeAlunos - 1,
        },
      });

      const novaMatricula = await prisma.alunosMatriculados.create({
        data: {
          studentId: user.matricula,
          classesId: classId,
        },
      });

      await prisma.classes.update({
        where: {
          id: classId,
        },
        data: {
          quantidadeDeAlunos: turma.quantidadeDeAlunos + 1,
        },
      });

      return res
        .status(200)
        .send("Cadastro na nova turma, relizado com sucesso!");
    }
    console.log(classId);

    if (turma.quantidadeDeAlunos === 45) {
      return res.status(400).send("Não há vagas disponíveis");
    }

    const novaMatricula = await prisma.alunosMatriculados.create({
      data: {
        studentId: user.matricula,
        classesId: classId,
      },
    });

    console.log(novaMatricula);

    await prisma.classes.update({
      where: {
        id: classId,
      },
      data: {
        quantidadeDeAlunos: turma.quantidadeDeAlunos + 1,
      },
    });
    console.log("Cadastrou a primeira");

    return res.status(200).send("Cadastro relizado com sucesso!");
  });

  app.get("/alunosnaomatriculados", async (req, res) => {
    try {
      const usuarios = await prisma.students.findMany({
        include: {
          turmasCadastradas: true,
        },
      });

      const filter = usuarios.map(async (aluno) => {
        if (aluno.turmasCadastradas.length === 0) {
          return {
            nome: aluno.nome,
            matricula: aluno.matricula,
            "data-de-nascimento": aluno.dataDeNascimento,
            curso: aluno.curso,
            serie: aluno.serie,
            turmasCadastradas: "nenhuma turma cadastrada",
          };
        }
        if (aluno.turmasCadastradas.length === 1) {
          const classe = await prisma.classes.findUnique({
            where: {
              id: aluno.turmasCadastradas[0].classesId,
            },
          });
          return {
            nome: aluno.nome,
            matricula: aluno.matricula,
            "data-de-nascimento": aluno.dataDeNascimento,
            curso: aluno.curso,
            serie: aluno.serie,
            turmasCadastradas: {
              nome: classe.nome,
              profesor: classe.professor,
              serie: classe.serie,
              "quantidade-de-alunos-matriculados": classe.quantidadeDeAlunos,
            },
          };
        }
      });
      const result = await Promise.all(filter);
      const teste = result.filter((element) => {
        if (element !== null) {
          return element;
        }
        return;
      });

      res
        .status(200)
        .send({
          message: "Usuários cadastrados em apenas uma ou nenhuma eletiva",
          data: teste,
        });
    } catch (error) {
      res.status(500).send({ message: "Error", data: error });
    }
  });
}
