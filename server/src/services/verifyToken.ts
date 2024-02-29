import * as jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

interface JwtPayload {
  matricula: string;
  "data-de-nascimento": string;
  iat: number;
  exp: number;
}
export async function validateToken(token: string) {
  const decodedToken = jwt.verify(
    token,
    String(process.env.JSON_WEB_TOKEN_SECRET)
  ) as JwtPayload;
  const user = await prisma.students.findUnique({
    where: {
      matricula: decodedToken.matricula,
      AND: {
        dataDeNascimento: decodedToken["data-de-nascimento"],
      },
    },
  });

  return user;
}
