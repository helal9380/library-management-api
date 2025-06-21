/** @format */

import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

const port = 3000;
let server: Server;

async function main() {
  try {
    await mongoose.connect(
      "mongodb+srv://helaldb:helaldb@cluster0.0qkhitp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
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
