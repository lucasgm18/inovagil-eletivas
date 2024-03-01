import fastify from "fastify";
import { EletivasRoutes } from "./routes/eletivas";
import { AuthRoutes } from "./routes/auth";
import cors from "@fastify/cors";

const app = fastify();

app.register(cors, {
  origin: "*",
});

app.register(EletivasRoutes, {
  prefix: "/class",
});
app.register(AuthRoutes, {
  prefix: "/auth",
});

app.get("/", (req, res) => {
  return res.status(200).send("Server is running");
});

app.listen(
  {
    port: Number(process.env.PORT),
    host: "0.0.0.0",
  },
  () => {
    console.log(`Server is running on http://0.0.0.0:${process.env.PORT}`);
  }
);
