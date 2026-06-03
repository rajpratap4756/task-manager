require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const taskRoutes = require("./routes/tasks");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(
  cors({
    origin: "*"
  })
);

app.use(express.json());

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is not set. Copy server/.env.example to server/.env");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.json({ message: "Task Manager API", version: "1.0.0" });
});

app.use("/tasks", taskRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
