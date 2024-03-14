import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function StudentsRoutes(app: FastifyInstance) {
  app.post("/", async (req, res) => {
    const bodySchema = z.object({
      data: z
        .object({
          matricula: z.string(),
          dataDeNascimento: z.string(),
          nome: z.string(),
          serie: z.string(),
          curso: z.string(),
        })
        .array(),
    });

    const { data } = bodySchema.parse(req.body);

    if (!data) {
      return res.status(400).send("Base de dados inválida");
    }
    try {
      const students = await prisma.users.createMany({
        data,
      });

      return res.status(200).send("Base de dados inserida no banco de dados")
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).send(error.message);
      }
    }
  });
}
