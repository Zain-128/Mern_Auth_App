import express from "express";
import { ConnectToMongo } from "./config/db.connect.js";
import dotenv from "dotenv";
import { router as AuthRouter } from "./routes/auth.routes.js";
import { ErrorHandler } from "./middlewares/ErrorHandler.js";

dotenv.config({});
const app = express();

app.use(express.json());
app.use("/api/v1/", AuthRouter);

app.use(ErrorHandler);
app.listen(process.env.PORT, () => {
  ConnectToMongo();
  console.log(`Server is Running ! `);
});
