import 'dotenv/config';
import express from "express";
import cors from 'cors'
import { adminAuthRoutes } from "./routes/adminAuth.routes.js";
import { userAuthRoutes } from "./routes/userAuth.routes.js";
import { imageRoutes } from './routes/image.routes.js';


const app = express();

/* ---------- MIDDLEWARE ---------- */
const allowedOrigins = [
  "http://localhost:3000", 
  "http://localhost:3001", 
  "http://localhost:5173", 
  "http://localhost:3002"
];

if (process.env.ALLOWED_ORIGINS) {
  const envOrigins = process.env.ALLOWED_ORIGINS.split(',');
  allowedOrigins.push(...envOrigins);
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
import cookieParser from "cookie-parser";

// ...

app.use(express.json());
app.use(cookieParser());

/* ---------- ROUTES ---------- */
app.use("/api/admin", adminAuthRoutes);

// future routes
app.use("/api/auth", userAuthRoutes);
app.use("/api/images", imageRoutes);

/* ---------- HEALTH CHECK ---------- */
app.get("/", (req, res) => {
  res.send("Image Gallery API is running");
});

/* ---------- ERROR HANDLING ---------- */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {}
  });
});

export default app;