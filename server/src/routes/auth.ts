import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function AuthRoutes(app: FastifyInstance) {
  app.post("/", async (req, res) => {
    const bodySchema = z.object({
      matricula: z.string(),
      dataDeNascimento: z.string(),
    });

    const { matricula, dataDeNascimento } = bodySchema.parse(req.body);

    const user = await prisma.students.findUnique({
      where: {
        matricula,
      },
    });
    if (user) {
      res.status(200).send(user);
    }
    res.status(200).send(false);
  });
}
