import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const User = () => {
  const navigate = useNavigate();

  const [isSignIn, setSignIn] = useState(false);

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSignInChange = (e) => {
    setSignInData({ ...signInData, [e.target.name]: e.target.value });
  };

  const handleSignUpChange = (e) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };

  const signUpToast = (e) => {
    if (!e.success) {
      const error = e.error;
      toast.warning(error, { position: "top-center" });
    } else {
      toast.success("Registered Successfully!", { position: "top-center" });

      setSignUpData({
        name: "",
        email: "",
        password: "",
      });
      setSignIn(true);
    }
  };

  const signInToast = (e) => {
    if (!e.success) {
      const error = e.error;
      toast.error(error, { position: "top-center" });
    } else {
      toast.success("Signed In Successfully!", { position: "top-center" });

      localStorage.setItem("authToken", e.authToken);
      localStorage.setItem("userName", e.userName);
      localStorage.setItem("userEmail", signInData.userEmail);

      setSignInData({
        email: "",
        password: "",
      });
      navigate(`/user/${e.userId}`);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    // Add your sign-up logic here
    const response = await fetch("http://localhost:4001/api/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: signUpData.name,
        email: signUpData.email,
        password: signUpData.password,
      }),
    });
    const json_data = await response.json();
    signUpToast(json_data);

    console.log("Sign up");
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    // Add your sign-in logic here
    const response = await fetch("http://localhost:4001/api/loginUser", {
      method : "POST",
      headers : {   // for cors
        "Content-Type" : "application/json",
      },
      body : JSON.stringify({
        email : signInData.email,
        password : signInData.password,
      }),
    })
    const json_data = await response.json();
    signInToast(json_data);

    console.log("Sign in");
  };

  return (
    <div className="w-full h-screen bg-[#EEEEEE]">

      <nav className="w-full h-10vh p-4 flex items-center justify-between px-24">
        <div>
          <h1 className="font-bold text-xl">Manager</h1>
        </div>
        <div className="flex gap-8 font-bold text-md">
           <button onClick={() => navigate("/")}>Login</button> 
           <button onClick={() => navigate("/")}>Register</button> 
        </div>
      </nav>

      {isSignIn ? (
        <div className="my-form flex flex-col p-8 bg-[#ffffff] w-full md:w-[30rem] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="form-body mb-4">
            <h2 className="text-2xl font-semibold">Sign In</h2>
            <p>
              Not registered yet?{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => setSignIn(false)}
              >
                Sign up
              </span>
            </p>
          </div>
          <div className="form-actual">
            <form onSubmit={handleSignInSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={signInData.email}
                onChange={handleSignInChange}
                className="border border-gray-300 rounded-md p-2"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={signInData.password}
                onChange={handleSignInChange}
                className="border border-gray-300 rounded-md p-2"
                required
              />
              <button
                type="submit"
                className="bg-black text-white font-bold px-4 py-2 rounded-md transition-colors duration-300"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="my-form flex flex-col p-8 bg-[#ffffff] w-full md:w-[30rem] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="form-body mb-4">
            <h2 className="text-2xl font-semibold">Sign Up</h2>
            <p>
              Already have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => setSignIn(true)}
              >
                Sign in
              </span>
            </p>
          </div>
          <div className="form-actual">
            <form onSubmit={handleSignUpSubmit} className="flex flex-col gap-4">
              <input
                type="name"
                name="name"
                placeholder="Name"
                value={signUpData.name}
                onChange={handleSignUpChange}
                className="border border-gray-300 rounded-md p-2"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={signUpData.email}
                onChange={handleSignUpChange}
                className="border border-gray-300 rounded-md p-2"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={signUpData.password}
                onChange={handleSignUpChange}
                className="border border-gray-300 rounded-md p-2"
                required
              />
              <button
                type="submit"
                className="bg-black text-white font-bold px-4 py-2 rounded-md transition-colors duration-300"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
