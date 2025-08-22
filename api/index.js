import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
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
app.use(express.json()); //request me json accept karne ke liye iska use karte hain.
app.use(cookieParser());

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT + "!!");
});

app.use("/api/user",userRouter);
app.use("/api/auth",authRouter);


//Middleware
/***
 * Jo tumne likha hai wo Express ka global error handling middleware hai.
  Express me error handler ka special signature hota hai:
  (err, req, res, next) => { ... }

  Aise middleware tab trigger hota hai jab tum apne code me next(error) call karte ho ya Express khud koi error throw karta hai.
 * 
 */
app.use((err,req, res,next)=>{

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return res.status(statusCode).json({
    success:false,
    statusCode,
    message
  });

});