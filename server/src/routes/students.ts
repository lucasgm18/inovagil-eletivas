import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function StudentsRoutes(app: FastifyInstance) {
  app.post("/", async (req, res) => {
    const bodySchema = z.object({
      data: z
        .object({
          curso: z.string(),
          dataDeNascimento: z.string(),
          nome: z.string(),
          matricula: z.string(),
          serie: z.string(),
        })
        .array(),
      secret: z.string().min(1, "O código admin deve ser preenchido"),
    });
    const { data, secret } = bodySchema.parse(req.body);

    if (!data) {
      return res.status(400).send({ message: "Base de dados inválida" });
    }
    if (secret === "Admin-ETE-Gil-Rodrigues-CdT") {
      try {
        const students = await prisma.users.createMany({
          data,
        });

        return res
          .status(200)
          .send({ message: "Base de dados inserida no banco de dados" });
      } catch (error) {
        if (error instanceof Error) {
          return res.status(500).send({ message: error.message });
        }
      }
    }
    return res.status(400).send({
      message: "Código admin inválido",
    });
  });
}
