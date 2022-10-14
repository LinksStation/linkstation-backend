import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import cluster from "cluster";
import os from "os";

dotenv.config();
const app = express();
const numCPUs = os.cpus().length;
const PORT = process.env.PORT || 5000;
const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

// MIDDLEWARES
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

// ROUTES
import userRoute from "./routes/userRoute.js";
import linkRoute from "./routes/linkRoute.js";
import authRoute from "./routes/authRoute.js";

const dbConnect = async () => {
  await mongoose
    .connect("mongodb://localhost:27017/linkstation", {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => console.log("🔗 db connected..."))
    .catch((error) => console.error(error));
};

dbConnect();

// USING ROUTE
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/link", linkRoute);

// SINGLE CORE UTILIZATION

if (process.argv[2] === "prod") {
  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
      cluster.fork();
    });
  } else {
    app.listen(PORT, () => {
      console.log(`🚀 server @ ${PORT} with ${process.pid} `);
    });
  }
} else {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
  });
}
