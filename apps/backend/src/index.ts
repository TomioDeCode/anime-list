import { Hono } from "hono";
import { Hello } from "@repo/types";

const app = new Hono();
console.log(Hello);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
