const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
let tasks = [];

app.get("/", (req, res) => {
  res.send("API Running");
});

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/tasks", (req, res) => {
  const task = {
    id: Date.now(),
    title: req.body.title,
    completed: false,
  };

  tasks.push(task);
  res.status(201).json(task);
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});