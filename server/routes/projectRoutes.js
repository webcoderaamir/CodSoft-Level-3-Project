const express = require("express");
const router = express.Router();
const project = require("../models/Project");
const task = require("../models/Task");

router.post("/createProject", async (req, res) => {
  try {
    await project.create({
      projectName : req.body.projectName,
      projectMembers : req.body.projectMembers,
      projectLeader : req.body.projectLeader
    });
    res.status(200).json({ success: true, message: "Project created" });
  } catch (err) {
    res.status(400).json({ success: false, error: "Server error" });
    console.log(err);
  }
});

router.post("/userProjects", async (req, res) => {
  try {
    const data = await project.find({ projectLeader: req.body.id });
    res.send(data);
  } catch (err) {
    res.status(400).json({ success: false, error: "Server error" });
    console.log(err);
  }
});

router.delete("/:project", async (req, res) => {
  try {
    const pId = req.params.project; 
    await task.deleteOne({ tasksProject: pId });
    const result  = await project.deleteOne({ _id : pId })
    res.status(200).json({ success: true, message: "Project deleted" });
  } catch (err) {
    res.status(400).json({ success: false, error: "Server error" });
    console.log(err);
  }
});


module.exports = router;
