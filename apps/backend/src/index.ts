import authApi from "src/controllers/auth.controller";
import { cors } from "hono/cors";
import { Hono } from "hono";

const app = new Hono().basePath("api");

app.use("/*", cors());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/auth", authApi);

export default app;
