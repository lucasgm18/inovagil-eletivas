import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function ClassesRoutes(app: FastifyInstance) {
  app.post("/", async (req, res) => {
    const bodySchema = z.object({
      nome: z.string().min(1, "A eletiva precisa ter um nome"),
      professor: z
        .string()
        .min(1, "A eletiva precisa ter um professor cadastrado"),
      serie: z.string().min(1).max(3),
      diaDaSemana: z.enum(["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA"]),
      vagas: z.number().min(1, "A eletiva precisar ter pelo menos 1 vaga"),
      secret: z
        .string()
        .min(1, "Você precisar possuir o código admin para criar uma eletiva"),
    });

    const { nome, professor, serie, diaDaSemana, vagas, secret } =
      bodySchema.parse(req.body);

    console.log(nome, professor, serie, diaDaSemana, vagas);

    if (secret === "Admin-ETE-Gil-Rodrigues-CdT") {
      try {
        const eletiva = await prisma.classes.create({
          data: {
            nome,
            professor,
            serie,
            diaDaSemana,
            vagas,
          },
        });

        if (eletiva) {
          return res.status(200).send("Eletiva cadastrada com sucesso");
        }
      } catch (error) {
        if (error instanceof Error) {
          return res.status(400).send(error.message);
        }
      }
    }
    return res.status(400).send({ message: "Código admin inválido" });
  });
}
