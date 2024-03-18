import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import * as jwt from "jsonwebtoken";

export async function AuthRoutes(app: FastifyInstance) {
  app.post("/", async (req, res) => {
    const bodySchema = z.object({
      matricula: z.string(),
      dataDeNascimento: z.string(),
    });

    const { matricula, dataDeNascimento } = bodySchema.parse(req.body);
    const date = dataDeNascimento;
    const user = await prisma.users.findUnique({
      where: {
        matricula,
      },
      include: {
        turmasCadastradas: true,
      },
    });
    if (user && user.dataDeNascimento === date) {
      const token = jwt.sign(
        { id: user.matricula, "data-de-nascimento": user.dataDeNascimento },
        String(process.env.JWTSECRET),
        {
          expiresIn: "24h",
        }
      );
      res.status(200).send({ user, token });
    }
    res.status(500).send("Usuário não validado");
  });

  app.post("/verify", async (req, res) => {
    const bodySchema = z.object({
      token: z.string(),
    });

    const { token } = bodySchema.parse(req.body);

    try {
      const verifiedToken = jwt.verify(token, String(process.env.JWTSECRET));
      if (!verifiedToken) {
        return res.status(500).send({ message: "Token inválido" });
      }
      return res
        .status(200)
        .send({ message: "Token válido", data: verifiedToken });
    } catch (error) {
      if (error instanceof Error) return error.message;
    }
  });

  app.get("/:matricula", async (req, res) => {
    const paramsSchema = z.object({
      matricula: z.string(),
    });

    const { matricula } = paramsSchema.parse(req.params);

    const user = await prisma.users.findUnique({
      where: {
        matricula,
      },
      include: {
        turmasCadastradas: true,
      },
    });

    if (!user) {
      return res.status(404).send("Usuário não cadastrado");
    }
    return res.status(200).send(user);
  });
}
