import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import Select from "react-select";
import ProgressBar from "react-bootstrap/ProgressBar"; // Import ProgressBar
import { toast } from "react-toastify";
import Task from "../components/Task";

const Project = () => {
  const location = useLocation();
  const data = location.state;
  const params = useParams();
  const user = params.userId;
  const navigate = useNavigate();

  const [showMembers, setShowMembers] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [taskData, setTaskData] = useState({
    taskName: "",
    taskAssigned: [],
    taskDueDate: "",
    taskStatus: "To do",
  });
  const [selectedOptions, setSelectOptions] = useState(false);
  const [task, setTasks] = useState([]);
  const [taskDone, setTaskDone] = useState(0);

  const updatePercentage = (status) => {
    if (status === "Completed") {
      setTaskDone((prevC) => prevC + 1);
    } else if (status === "To do") {
      setTaskDone((prevC) => prevC - 1);
    }
  };

  var completed = taskDone;
  var todo = task.length !== 0 ? task[0].tasks.length : 1;
  var percentage = Math.floor((completed / todo) * 100);

  const optValue = data.projectMembers.map((e, i) => {
    return {
      label: e,
      value: e,
    };
  });

  const handleSelect = (data) => {
    setSelectOptions(data);
    const members = data.map((e) => e.value);
    setTaskData({
      ...taskData,
      taskAssigned: members,
    });
  };

  const handleChange = (e) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchTask = async () => {
    const response = await fetch("http://localhost:4001/api/projectTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: data._id,
      }),
    });
    let json_data = await response.json();
    setTasks(json_data);
  };

  useEffect(() => {
    fetchTask();
  }, []);

  const notification = (data) => {
    if (!data.success) {
      const error = data.error;
      toast.warning(error, { position: "top-center" });
    } else {
      toast.success("New project added", { position: "top-center" });
      setTaskData({
        taskName: "",
        taskAssigned: [],
        taskDueDate: "",
        taskStatus: "To do",
      });
      setSelectOptions([]);
      setIsOpen(false);
      fetchTask();
    }
  };

  const DeleteNotification = (data) => {
    if (!data.success) {
      const err = data.error;
      toast.error(err, { position: "top-center" });
    } else {
      toast.success("Project deleted", { position: "top-center" });
      navigate(`/user/${user}`);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete")) {
      const response = await fetch(`http://localhost:4001/api/${data._id}`, {
        method: "DELETE",
      });
      const json_data = await response.json();
      DeleteNotification(json_data);
    } else {
      console.log("Deletion cancelled");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4001/api/addTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tasksProject: data._id, taskData: taskData }), // Include tasksProject field
      });
      const json_data = await response.json();
      notification(json_data);
    } catch (error) {
      console.error("Error adding task:", error);
      // Handle error (e.g., display error message)
    }
  };

  const toggleMembers = () => {
    setShowMembers(!showMembers);
  };

  return (
    <>
      <div className="projectpage w-full min-h-screen">
        <Navbar />

        <div className="header flex flex-col lg:flex-row justify-between items-center bg-gray-100 px-4 py-2 rounded-md border-b border-grey">
          <div className="flex items-center space-x-2">
            <div className="pName text-white rounded-md p-2">{`P${data.key}`}</div>
            <div className="text-lg font-semibold">{data.projectName}</div>
          </div>

          <div className="flex items-center space-x-2 mt-2 lg:mt-0">
            <button
              className="flex items-center justify-between bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
              onClick={toggleMembers}
            >
              Project members
              {showMembers ? (
                <MdArrowDropUp className="w-6 h-6" />
              ) : (
                <MdArrowDropDown className="w-6 h-6" />
              )}
            </button>

            {showMembers && (
              <div className="hide-scrollbar absolute mt-60 w-60 bg-white rounded-md shadow-md z-10 max-h-48 overflow-y-auto">
                {data.projectMembers.map((member, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {member}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 mt-2 lg:mt-0">
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDelete(data._id)}
            >
              <MdDelete className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="hero flex flex-col lg:flex-row">

          <div className="left lg:w-1/4 h-auto lg:h-[84vh] p-2 border-r-[1px]">
            {isOpen && (
              <form
                onSubmit={handleSubmit}
                className="add-task-body px-2 border rounded sm:px-0 py-4"
              >
                <textarea
                  name="taskName"
                  value={taskData.taskName}
                  placeholder="Write a task"
                  rows={2}
                  required
                  autoComplete="off"
                  autoFocus
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-gray-600"
                ></textarea>

                <Select
                  required
                  className="react-select mt-2"
                  options={optValue}
                  placeholder="Assign task"
                  value={selectedOptions}
                  onChange={handleSelect}
                  isSearchable={true}
                  isMulti
                />

                <div className="flex mt-2">
                  <input
                    required
                    value={taskData.taskDueDate}
                    onChange={handleChange}
                    type="date"
                    name="taskDueDate"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-gray-600"
                  />
                  <button
                    type="submit"
                    className="addT1 ml-2 px-4 py-2 text-white font-bold rounded-md focus:outline-none focus:bg-gray-600"
                  >
                    Add
                  </button>
                </div>
              </form>
            )}

            <div
              className="add-task-btn flex items-center justify-center mt-4"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="addT2 text-white px-4 py-2 mb-4 rounded-md cursor-pointer">
                + Add task
              </div>
            </div>

            <hr />

            <div className="mb-2 mt-3 text-dark fw-bold">Task progress</div>
            <ProgressBar
              variant={`${
                percentage <= 30
                  ? "danger"
                  : percentage <= 60
                  ? "warning"
                  : "success"
              }`}
              now={percentage}
              animated
              label={`${percentage}%`}
            />
          </div>

          <div className="right lg:w-3/4 h-auto lg:h-[84vh]">
            {task.length !== 0 ? (
              task[0].tasks.map((e, i) => {
                return (
                  <Task
                    key={i}
                    name={e.taskName}
                    date={e.taskDueDate}
                    assigned={e.taskAssigned}
                    updateCounts={updatePercentage}
                  />
                );
              })
            ) : (
              <div>No task Added Yet</div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default Project;
