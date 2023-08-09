const { Task, validate } = require("../model/tasks");
const express = require("express");
const router = express.Router();
router.use(express.json());

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const totalTasks = await Task.countDocuments();

    const tasks = await Task.find().skip(startIndex).limit(limit);

    const pagination = {};

    if (endIndex < totalTasks) {
      pagination.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit: limit,
      };
    }
    res.json({ pagination, data: tasks });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { title, description, completed, createAt } = req.body;

  const task = new Task({
    title: title,
    description: description,
    completed: completed,
    createAt: createAt,
  });

  await task.save();
  res.json({ message: "task has been added successfuly", data: task });
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const task = await Task.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      description: req.body.description,
      completed: req.body.completed,
      createAt: req.body.createAt,
    },
    { new: true }
  );
  if (!task) return res.status(404).send("Task not found with the given id.");

  await task.save();
  res.json({ message: "Task has been updated successfuly.", data: task });
});

router.get("/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).send("Task not found with the given id.");
  res.send(task);
});

router.delete("/:id", async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).send("Task not found with the given id.");
  res.send("Task has been deleted successfuly.");
});

module.exports = router;
