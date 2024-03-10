import React, { useState, useEffect } from "react";

const Task = ({ name, date, assigned, updateCounts }) => {
  const [status, setStatus] = useState(() => {
    const storedStatus = localStorage.getItem(name);
    return storedStatus ? storedStatus : "To do";
  });
  const newDate = date.slice(5, date.length);

  useEffect(() => {
    localStorage.setItem(name, status);
  }, [status, name]);

  const handleStatus = () => {
    setStatus((prevStatus) => {
      const newStatus = prevStatus === "To do" ? "Completed" : "To do";
      updateCounts(newStatus);
      return newStatus;
    });
  };

  return (
    <div
      className={`p-3 bg-gray-800 text-[#fff] ${
        status === "To do" ? "border border-red-500" : "border border-green-500"
      } ${status === "To do" ? "opacity-100" : "opacity-50"}`}
    >
      <div className="task-body">{name}</div>

      <div className="task-footer flex flex-col lg:flex-row justify-between items-start lg:items-center">
        <div
          className={`task-status px-3 py-1 rounded mb-2 lg:mb-0 ${
            status === "To do" ? "bg-red-500" : "bg-green-500"
          } text-white`}
        >
          {status}
        </div>

        <div className="task-date text-[#fff] lg:ml-2 mb-2 lg:mb-0">
          {newDate}
        </div>

        <div className="flex flex-wrap items-center">
          {assigned.map((e, i) => (
            <div className="mr-2 mb-2" key={i}>
              <div className="flex items-center text-sm bg-gray-200 text-black rounded-full px-3 py-1">
                <span className="mr-1">{e}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 fill-current text-gray-600 cursor-pointer"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a8 8 0 0 0-8 8c0 4.418 3.582 8 8 8s8-3.582 8-8a8 8 0 0 0-8-8zm0 14a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm-2-8a1 1 0 0 0 1 1h2a1 1 0 0 0 0-2H9a1 1 0 0 0-1 1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          ))}

          <button
            onClick={handleStatus}
            className={`task-submit p-2 rounded-full ${
              status === "To do"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            <span>&#10004;</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Task;
