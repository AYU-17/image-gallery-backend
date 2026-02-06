import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

/* ---------- DATABASE CONNECTION ---------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });