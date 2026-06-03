const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const filter = {};
    const { status, search } = req.query;

    if (status === "active") filter.completed = false;
    else if (status === "completed") filter.completed = true;

    if (search && String(search).trim()) {
      filter.title = { $regex: String(search).trim(), $options: "i" };
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      title: String(title).trim(),
      description: description ? String(description).trim() : "",
      dueDate: dueDate ? new Date(dueDate) : null,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const { title, description, dueDate, completed } = req.body;

    if (title !== undefined) {
      if (!String(title).trim()) {
        return res.status(400).json({ message: "Title cannot be empty" });
      }
      task.title = String(title).trim();
    }

    if (description !== undefined) {
      task.description = String(description).trim();
    }

    if (dueDate !== undefined) {
      task.dueDate = dueDate ? new Date(dueDate) : null;
    }

    if (completed !== undefined) {
      task.completed = Boolean(completed);
    }

    await task.save();
    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.put("/:id/toggle", async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
