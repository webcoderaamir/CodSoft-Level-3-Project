const express = require("express");
const router = express.Router();
const task = require("../models/Task");

router.post("/addTask", async (req, res) => {
  try {
    const { tasksProject, taskData } = req.body;
    let existingTask = await task.findOne({ tasksProject });

    if (!existingTask) {
      // If there is no existing task for the project, create a new task
      await task.create({
        tasksProject,
        tasks: [taskData],
      });
    } else {
      // If there is an existing task for the project, update it by pushing the new task data
      await task.findOneAndUpdate(
        { tasksProject },
        { $push: { tasks: taskData } }
      );
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/projectTask", async (req, res) => {
  try {
    const { id } = req.body;
    const data = await task.find({ tasksProject: id });
    res.status(200).send(data);
  } catch (error) {
    console.error("Error fetching project tasks:", error);
    res.status(400).json({ error: "Something went wrong" });
  }
});

module.exports = router;
