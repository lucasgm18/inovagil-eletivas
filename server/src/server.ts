import fastify from "fastify";
import { EletivasRoutes } from "./routes/eletivas";
import { AuthRoutes } from "./routes/auth";
import cors from "@fastify/cors";
import { ExportData } from "./routes/data";
import { ClassesRoutes } from "./routes/classes";
import { StudentsRoutes } from "./routes/students";

const app = fastify();

app.register(cors, {
  origin: "*",
  methods: ["POST", "GET", "DELETE", "PUT"],
});

app.register(EletivasRoutes, {
  prefix: "/class",
});

app.register(ClassesRoutes, {
  prefix: "/eletiva",
});
app.register(AuthRoutes, {
  prefix: "/auth",
});
app.register(ExportData, {
  prefix: "/export",
});
app.register(StudentsRoutes, {
  prefix: "/students",
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
