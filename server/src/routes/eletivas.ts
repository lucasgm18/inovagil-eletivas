import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import * as ExcelJs from "exceljs";
import { join } from "path";

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
      include: {
        alunosMatriculados: true,
        _count: true,
      },
    });

    if (classes) {
      const turmas = await Promise.all(
        classes.map(async (turma) => {
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
            id: turma.id,
            nome: turma.nome,
            professor: turma.professor,
            vagas: turma.vagas,
            alunos,
            diaDaSemana: turma.diaDaSemana,
          };
        })
      );

      //   const workbook = new ExcelJs.Workbook();
      //   const worksheet = workbook.addWorksheet("Alunos matriculados", {
      //     views: [{ state: "frozen", xSplit: 1, ySplit: 1 }],
      //   });

      //   worksheet.columns = [
      //     { header: "Turma", key: "turma" },
      //     { header: "Professor", key: "professor" },
      //     { header: "Quantidade de alunos matriculados", key: "quantidade" },
      //     { header: "Alunos matriculados", key: "alunos" },
      //   ];

      //   turmas.map(
      //     (turma: {
      //       turma: string;
      //       alunos: {
      //         nome: string;
      //         matricula: string;
      //       }[];
      //       professor: string;
      //       quantidade: number;
      //     }) => {
      //       return worksheet.addRow({
      //         turma: turma.turma,
      //         professor: turma.professor,
      //         quantidade: turma.quantidade,
      //         alunos: turma.alunos.map(
      //           (aluno: { nome: string; matricula: string }) => {
      //             return `${aluno.nome} - ${aluno.matricula}`;
      //           }
      //         ),
      //       });
      //     }
      //   );

      //   const filePath = join(__dirname, "..", "public", "test.xlsx");
      //   await workbook.xlsx.writeFile(filePath);
      return res.status(200).send(turmas);
    }

    return res.status(500).send("Erro interno");
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

    const user = await prisma.users.findUnique({
      where: {
        matricula,
      },
    });
    const turma = await prisma.classes.findUnique({
      where: {
        id: classId,
      },
      include: {
        alunosMatriculados: true,
        _count: true,
      },
    });

    if (user && turma) {
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
            include: {
              alunosMatriculados: true,
            },
          });
          if (pivo[0].classesId === classId) {
            return res
              .status(400)
              .send("Usuário já cadastrado nessa disciplina");
          }

          if (
            turma &&
            classFromPivo &&
            classFromPivo.diaDaSemana === turma.diaDaSemana
          ) {
            if (turma._count.alunosMatriculados === turma.vagas) {
              return res.status(400).send("Não há vagas disponíveis");
            }
            await prisma.alunosMatriculados.delete({
              where: {
                id: pivo[0].id,
              },
            });

            const novaMatricula = await prisma.alunosMatriculados.create({
              data: {
                classesId: turma.id,
                studentId: user.matricula,
              },
            });

            return res.status(200).send("Cadastro relizado com sucesso!");
          }

          if (turma && turma._count.alunosMatriculados >= turma.vagas) {
            console.log("não cadastrou");
            return res.status(200).send(`As vagas dessa turma acabaram`);
          }

          const novaMatricula = await prisma.alunosMatriculados.create({
            data: {
              classesId: turma.id,
              studentId: user.matricula,
            },
          });

          console.log("Cadastrou a segunda");
          return res.status(200).send("Cadastro relizado com sucesso!");
        }
        if (pivo.length === 2) {
          if (
            pivo[0].classesId === turma.id ||
            pivo[1].classesId === turma.id
          ) {
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
          if (
            firstClassFromPivo &&
            firstClassFromPivo.diaDaSemana === turma.diaDaSemana
          ) {
            if (turma._count.alunosMatriculados === turma.vagas) {
              return res.status(400).send("Não há vagas disponíveis");
            }
            await prisma.alunosMatriculados.delete({
              where: {
                id: pivo[0].id,
              },
            });

            const novaMatricula = await prisma.alunosMatriculados.create({
              data: {
                classesId: turma.id,
                studentId: user.matricula,
              },
            });

            return res
              .status(200)
              .send("Cadastro na nova turma, relizado com sucesso!");
          }
          if (
            secondClassFromPivo &&
            secondClassFromPivo.diaDaSemana === turma.diaDaSemana
          ) {
            if (turma._count.alunosMatriculados === turma.vagas) {
              return res.status(400).send("Não há vagas disponíveis");
            }
            console.log("passou pelo limitador");
            await prisma.alunosMatriculados.delete({
              where: {
                id: pivo[1].id,
              },
            });

            const novaMatricula = await prisma.alunosMatriculados.create({
              data: {
                classesId: turma.id,
                studentId: user.matricula,
              },
            });

            return res
              .status(200)
              .send("Cadastro na nova turma, relizado com sucesso!");
          }

          if (turma._count.alunosMatriculados === turma.vagas) {
            console.log("não tem vagas primeiro cadastro");
            return res.status(400).send("Não há vagas disponíveis");
          }

          await prisma.alunosMatriculados.delete({
            where: {
              id: pivo[0].id,
            },
          });

          const novaMatricula = await prisma.alunosMatriculados.create({
            data: {
              classesId: turma.id,
              studentId: user.matricula,
            },
          });

          console.log("Cadastrou a segunda, deletando a primeira");
          return res
            .status(200)
            .send("Cadastro na nova turma, relizado com sucesso!");
        }

        if (turma._count.alunosMatriculados === turma.vagas) {
          console.log(turma._count.alunosMatriculados);
          return res.status(400).send("Não há vagas disponíveis");
        }
        const novaMatricula = await prisma.alunosMatriculados.create({
          data: {
            classesId: turma.id,
            studentId: user.matricula,
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

        if (turma._count.alunosMatriculados === turma.vagas) {
          return res.status(400).send("Não há vagas disponíveis");
        }

        await prisma.alunosMatriculados.delete({
          where: {
            id: pivo[0].id,
          },
        });

        const novaMatricula = await prisma.alunosMatriculados.create({
          data: {
            studentId: user.matricula,
            classesId: classId,
          },
        });

        return res
          .status(200)
          .send("Cadastro na nova turma, relizado com sucesso!");
      }
      console.log(classId);

      if (turma._count.alunosMatriculados === turma.vagas) {
        return res.status(400).send("Não há vagas disponíveis");
      }

      const novaMatricula = await prisma.alunosMatriculados.create({
        data: {
          studentId: user.matricula,
          classesId: classId,
        },
      });

      console.log(novaMatricula);

      console.log("Cadastrou a primeira");

      return res.status(200).send("Cadastro relizado com sucesso!");
    }
  });

  app.get("/alunosnaomatriculados", async (req, res) => {
    try {
      const usuarios = await prisma.users.findMany({
        where: {
          serie: "2",
        },
        include: {
          turmasCadastradas: true,
          _count: true,
        },
      });

      const filter = usuarios.map(async (aluno) => {
        if (aluno._count.turmasCadastradas === 0) {
          return {
            nome: aluno.nome,
            matricula: aluno.matricula,
            "data-de-nascimento": aluno.dataDeNascimento,
            curso: aluno.curso,
            serie: aluno.serie,
            turmasCadastradas: "nenhuma turma cadastrada",
          };
        }
        if (aluno._count.turmasCadastradas === 1) {
          const classe = await prisma.classes.findUnique({
            where: {
              id: aluno.turmasCadastradas[0].classesId,
            },
            include: {
              alunosMatriculados: true,
              _count: true,
            },
          });
          if (classe) {
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
                "quantidade-de-alunos-matriculados":
                  classe._count.alunosMatriculados,
              },
            };
          }
        }
      });
      const result = await Promise.all(filter);
      const teste = result.filter((element) => {
        if (element !== null) {
          return element;
        }
        return;
      });

      res.status(200).send({
        message: "Usuários cadastrados em apenas uma ou nenhuma eletiva",
        data: teste,
      });
    } catch (error) {
      res.status(500).send({ message: "Error", data: error });
    }
  });
}
