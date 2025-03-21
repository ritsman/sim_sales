// AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import axios from "axios";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
    //   const response = await fetch(`${config.API_URL}/api/superAdmin/login`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ email, password }),
    //   });

      const response = await axios.post(
        `${config.API_URL}/api/superAdmin/login`,{email,password}
      );

      const data = response.data;

      console.log(response);

          // Store admin token in localStorage
      localStorage.setItem("adminToken", data.token);

      // Redirect to admin dashboard
      navigate("/admin/dashboard");
    } catch (err) {
        console.log(err);
      setError(err.message);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        {error && <div className="error-message">{error}</div>}

        <div className="flex items-center justify-center w-screen h-screen bg-white">
          <div className="w-full md:pt-8 pb-0 max-w-md">
            <div className="bg-[#0d4a2b] shadow-xl rounded-xl md:px-8 px-6 pb-8 mb-4 border border-gray-200">
              {/* Logo section */}
              <div className="flex justify-center pt-8 pb-6">
                <div className="flex items-center">
                  <div className="text-gray-200  text-2xl font-bold">
                    Admin Login
                  </div>
                </div>
              </div>

              <form>
                <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                  {/* <div className="text-green-800 text-xl font-semibold mb-6 text-center">
                Login to your account
              </div> */}

                  {/* Username input */}
                  <div className="mb-5">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Email
                    </label>
                    <div className="flex items-center bg-white rounded-md px-3 py-3 border border-green-600">
                      <svg
                        className="text-green-600 w-5 h-5 mr-3"
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your Email"
                        className="bg-white text-gray-800 placeholder-gray-400 focus:outline-none w-full"
                      />
                    </div>
                  </div>

                  {/* Password input */}
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Password
                    </label>
                    <div className="flex items-center bg-white rounded-md px-3 py-3 border border-green-600">
                      <svg
                        className="text-green-600 w-5 h-5 mr-3"
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
                        placeholder="Enter your password"
                        className="bg-white text-gray-800 placeholder-gray-400 focus:outline-none w-full"
                      />
                    </div>
                  </div>

                  {/* Remember me and forgot password */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-green-600"
                      />
                      <label className="ml-2 text-gray-600 text-sm">
                        Remember me
                      </label>
                    </div>
                    <a
                      href="#"
                      className="text-green-600 text-sm hover:text-green-800"
                    >
                      Forgot Password?
                    </a>
                  </div>

                  {/* Login button */}
                  <button
                    onClick={handleSubmit}
                    className="bg-[#310b6b] hover:bg-green-700 text-white font-bold py-3 px-4 rounded w-full transition duration-200"
                  >
                    LOGIN
                  </button>
                </div>
              </form>

              {/* Footer */}
            
            </div>

            {/* <div className="text-center text-gray-500 text-xs">
          © 2025 Sales Management System. All rights reserved.
        </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
