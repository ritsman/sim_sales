import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import config from "../../config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(
    "Enter your Email and we'll send you a link to reset your password"
  );
  async function handleSubmit(e) {
    setLoading(true);
    e.preventDefault();
    try {
      let res = await axios.post(
        `${config.API_URL}/api/auth/forgotPassword`,
        { email }
      );
      console.log(res);
      setMessage("reset link has been sent to your email ");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  return (
    <>
      <div className="flex items-center justify-center w-screen h-screen bg-gray-600">
        <div className="w-full md:pt-24  pb-0 max-w-md">
          <div className="bg-gray-800 shadow-md rounded-xl md:px-8 px-4  pb-10 mb-4">
            <form onSubmit={handleSubmit}>
              <div className=" flex items-center justify-center pt-10">
                <div className="bg-gray-900 rounded-lg shadow-lg p-8">
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
                          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v-2H5a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-300 font-semibold text-2xl text-center">
                      Forgot Password
                    </p>
                    <p className="text-center text-gray-300">{message}</p>
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
                          placeholder="Email"
                          value={email}
                          onChange={(e) =>
                            setEmail(e.target.value.toLowerCase())
                          }
                          className="bg-gray-800 text-gray-400 placeholder-gray-500 focus:outline-none w-full"
                        />
                      </div>
                    </div>

                    <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded w-full">
                      {loading ? "SUBMITING" : "SUBMIT"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <div className=" text-center">
              <Link
                to="/"
                className="text-indigo-500 hover:text-indigo-700 font-semibold"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
