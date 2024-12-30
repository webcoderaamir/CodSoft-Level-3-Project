import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useParams } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";

const Home = () => {
  const params = useParams();
  const userId = params.userId;
  const name = localStorage.getItem("userName");
  const email = localStorage.getItem("userEmail");

  var day = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = new Date();
  const dayOfWeek = day[date.getDay()];
  const daydate = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  const [show, setShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [selectOptions, setSelectOptions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectData, setProjectData] = useState({
    projectName: "",
    projectMembers: [email],
  });

  const showHandle = () => {
    // Set selectOptions with user's email
    // setSelectOptions([{ label: email, value: email }]);
    setShow(true);
  };

  const hideHandle = () => setShow(false);

  // for select email in option css
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "blue" : "white",
      color: state.isSelected ? "white" : "black",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: state.isSelected ? "blue" : "#f2f2f2",
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "80px",
      overflowY: "auto",
      zIndex: 9999,
      "&::-webkit-scrollbar": {
        display: "none",
      },
    }),
  };

  const changeHandler = (e) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
  };

  const selectHandler = (data) => {
    setSelectOptions(data);
    var members = data.map((e) => {
      return e.value;
    });
    setProjectData({
      ...projectData,
      projectMembers: [...projectData.projectMembers, ...members],
    });
  };

  const fetchProject = async () => {
    const response = await fetch("http://localhost:4001/api/userProjects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userId,
      }),
    });
    let json_data = await response.json();
    setProjects(json_data);
  };

  const fetchUser = async () => {
    try {
      const response = await fetch("http://localhost:4001/api/userid", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await response.json();
      console.log("User data:", userData); // For debugging
      if (userData.success && Array.isArray(userData.data)) {
        const userOptions = userData.data.map((user) => ({
          label: user.email,
          value: user.email,
        }));
        // Clear select options, making it empty
        setSelectOptions([]);
        setOptions(userOptions);
      } else {
        console.error("User data is not in the expected format:", userData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchProject();
    fetchUser();
  }, []);

  const Notification = (data) => {
    if (!data.success) {
      const err = data.error;
      toast.error(err, { position: "top-center" });
    } else {
      toast.success("New project added", { position: "top-center" });
      hideHandle();
      setProjectData({
        projectName: "",
        projectMembers: [],
      });
      // Reset selectOptions to user's email after successful project creation
      if (email) {
        setSelectOptions([{ label: email, value: email }]);
      }
      fetchProject();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:4001/api/createProject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectName: projectData.projectName,
        projectMembers: projectData.projectMembers,
        projectLeader: userId,
      }),
    });
    const json_data = await response.json();
    Notification(json_data);
  };

  // const filteredProjects = projects.filter((project) => {
  //   project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  // });

  return (
    <>
      <div className="home min-h-screen bg-gradient-to-b from-gray-300 to-gray-300">
        <Navbar setSearchQuery={setSearchQuery} />

        <div className="home-body mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-sm md:text-3xl lg:text-sm font-semibold">
            Join: {daydate} {month} {year}, {dayOfWeek}
          </p>
          <p className="text-4xl md:text-5xl lg:text-4xl tracking-tight mt-1">
            Pleasure, {name}
          </p>

          <div className="grid-item mt-4" onClick={showHandle}>
            <div className="project transition-[.2] hover:bg-white p-4 rounded-lg shadow-md flex items-center justify-center cursor-pointer">
              <div className="create-project-icon text-3xl mb-1 md:text-3xl text-black flex items-center justify-center">
                <h1>+</h1>
              </div>
              <div className="create-project-title text-lg md:text-xl font-semibold ml-2">
                Create project
              </div>
            </div>
          </div>

          <div className="project-container mt-4 md:mt-8">
            <div className="container-heading text-lg md:text-xl lg:text-2xl font-bold">
              Projects
            </div>

            <div className="create-project-section mt-3 md:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project, i) => {
                return (
                  <div className="grid-item" key={i}>
                    <Link
                      to={`/${userId}/p${i + 1}`}
                      state={{ ...project, key: i + 1 }}
                      className="block"
                    >
                      <div className="project transition-[.2] hover:bg-white p-4 rounded-lg shadow-md flex items-center cursor-pointer">
                        <div className="project-logo bg-black text-white text-xl md:text-xl rounded-full w-10 md:w-10 h-10 md:h-10 flex items-center justify-center">
                          {`P${i + 1}`}
                        </div>
                        <div className="project-title text-lg md:text-xl font-semibold ml-2">
                          {project.projectName}
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {show && (
        <div className="modal fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit} className="w-full">

                <div className="bg-white px-4 pt-5 pb-1 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">

                    <div className="create-pj-box text-left sm:text-left">
                      <h3
                        className="text-lg leading-6 font-medium text-gray-900"
                        id="modal-title"
                      >
                        New Project
                      </h3>

                      <div className="mt-2">
                        
                        <div className="mb-4">
                          <label
                            htmlFor="projectName"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Project name
                          </label>
                          <input
                            maxLength={35}
                            type="text"
                            name="projectName"
                            autoComplete="off"
                            onChange={changeHandler}
                            required
                            placeholder="Enter project name"
                            className="mt-1 p-2 block w-full md:w-[30vw] sm:text-sm border border-gray-300 rounded-md"
                          />
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor="projectMembers"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Project members
                          </label>

                          <Select
                            options={options}
                            placeholder="Add project members"
                            value={selectOptions}
                            onChange={selectHandler}
                            isSearchable={true}
                            isMulti
                            className="mt-1"
                            styles={customStyles}
                          />
                        </div>

                      </div>
                    </div>

                  </div>
                </div>

                <div className="button bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">

                  <button
                    type="submit"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-black text-base font-medium text-[#fff] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Create
                  </button>

                  <button
                    onClick={hideHandle}
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>

                </div>

              </form>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default Home;
