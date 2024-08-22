import express from "express";
import { ConnectToMongo } from "./config/db.connect.js";
import dotenv from "dotenv";

dotenv.config({});
const app = express();

app.listen(process.env.PORT, () => {
  ConnectToMongo();
  console.log(`Server is Running ! `);
});
