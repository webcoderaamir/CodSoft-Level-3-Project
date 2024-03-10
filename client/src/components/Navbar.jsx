import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = ({ setSearchQuery }) => {
    const params = useParams();
    const navigate = useNavigate();
    const userId = params.userId;

    const [search, setSearch] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");

        toast.error("Logged out!", { position: "top-center" });
        setTimeout(() => {
            navigate("/");
        }, 1000);
    };

    const handleSearchChange = (e) => {
        // console.log(e.target.value)
        const value = e.target.value;
        setSearch(value);
        setSearchQuery(value);
    };

    return (
        <>
            <div className="navbar bg-gray-800 text-white py-4">

                <div className="container mx-auto flex justify-between items-center px-4">

                    <div className="title cursor flex items-center">
                        <div className="flex items-center">
                            <h4>
                                {" "}
                                <Link to={`/user/${userId}`}>Manager</Link>{" "}
                            </h4>
                        </div>
                    </div>

                    <div className="search relative">
                        <input
                            type="text"
                            value={search}
                            onChange={handleSearchChange}
                            placeholder="Search project"
                            className="bg-gray-700 px-3 py-1 rounded-lg focus:outline-none focus:bg-gray-900 text-sm"
                        />
                        <div className="absolute right-0 top-0 mt-2 mr-2">
                            <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 15l6-6-6-6M10 17l-6-6 6-6"
                                ></path>
                            </svg>
                        </div>
                    </div>

                    <div
                        className="logout cursor-pointer hover:text-gray-300 transition duration-300"
                        onClick={handleLogout}
                    >
                        Logout
                    </div>
                    
                </div>

            </div>
        </>
    );
};

export default Navbar;
