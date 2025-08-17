import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// ✅ Explicit path
// dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config();

const PORT = 3000;
const MONGO_URI = process.env.MONGO_URI;

console.log("Mongo URI from env:", MONGO_URI); // debug karo

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const app = express();

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT + "!!");
});
