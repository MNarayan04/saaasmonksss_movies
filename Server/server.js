import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import fileUpload from "express-fileupload";

const app = express();
dotenv.config();

app.use(fileUpload());
app.use(express.json());

app.use(cors());


const PORT = 8001;

// Database connect
mongoose
  .connect("mongodb+srv://harshkr2709:b6nW1KLPjJtwBB4o@cluster0.4ovzb3m.mongodb.net/?retryWrites=true&w=majority")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

import moviesController from './Controllers/MoviesController.js';

app.use("/api/v1/moviecritic", moviesController);

app.get("/", (req, res) => {
  res.send("Hello SaasMonk!!!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
