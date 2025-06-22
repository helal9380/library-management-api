/** @format */

import "dotenv/config";
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

const port = process.env.PORT;
let server: Server;

async function main() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.BONGODB_USER}:${process.env.BONGODB_PASSWORD}@cluster0.0qkhitp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("connected to mongoose");
    server = app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
