import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import config from "../../../config";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  function handleLogin(event) {
    event.preventDefault();
    navigate("/");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    console.log({ name, email, password, confirmPassword });
    if (password !== confirmPassword) {
      // Fixed comparison operator
      alert("Password and confirm password do not match");
      return;
    } else {
      try {
        let response = await axios.post(
           `${config.API_URL}/api/auth/register`,
          {
            name: name,
            user: email,
            password: password,
          }
        );
        console.log(response);
        toast.success("User Signed Up successfully");
        navigate("/");
      } catch (error) {
        console.log("register error", error.response);
        toast.error("error in Signing up");
      }
    }
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen pb-10  bg-gray-600">
      <div className="w-full md:pt-24 pt-20 pb-0 max-w-md">
        <div className="bg-gray-800 rounded-md flex items-start py-10 justify-center ">
          <div className="bg-gray-900 rounded-lg shadow-lg md:p-10 p-10 px-12">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gray-700 rounded-full w-20 h-20 flex items-center justify-center">
                <svg
                  className="text-gray-400 w-12 h-12"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <div className="mb-4">
                <div className="flex items-center bg-gray-800 rounded-md px-3 py-2">
                  <svg
                    className="text-gray-400 w-5 h-5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="bg-gray-800 text-gray-400 placeholder-gray-500 focus:outline-none w-full"
                  />
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center bg-gray-800 rounded-md px-3 py-2">
                  <svg
                    className="text-gray-400 w-5 h-5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="bg-gray-800 text-gray-400 placeholder-gray-500 focus:outline-none w-full"
                  />
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center bg-gray-800 rounded-md px-3 py-2">
                  <svg
                    className="text-gray-400 w-5 h-5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="bg-gray-800 text-gray-400 placeholder-gray-500 focus:outline-none w-full"
                  />
                </div>
              </div>
              <div className="mb-6">
                <div className="flex items-center bg-gray-800 rounded-md px-3 py-2">
                  <svg
                    className="text-gray-400 w-5 h-5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="bg-gray-800 text-gray-400 placeholder-gray-500 focus:outline-none w-full"
                  />
                </div>
              </div>
              <button
                onClick={handleSubmit}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded w-full"
              >
                SIGN UP
              </button>
            </div>
            <div className="mt-4 text-center">
              <span className="text-gray-600">Already have an account?</span>{" "}
              <Link
                to="/"
                className="text-indigo-500 hover:text-indigo-700 font-semibold"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
