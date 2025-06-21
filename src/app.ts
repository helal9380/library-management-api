/** @format */
import express, { Application, Request, Response } from "express";
import { bookRoutes } from "./app/routes/bookRoutes";
import { borrowRoutes } from "./app/routes/borrowRoutes";
const app: Application = express();

// middleware
app.use(express.json());

app.use("/books", bookRoutes);
app.use("/borrow", borrowRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

export default app;
