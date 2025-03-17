import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import config from "../../config";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Enter your new password");
  const [error, setError] = useState("");
  const params = useParams();

  async function handleSubmit(e) {
    setLoading(true);
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Replace the following with your actual backend API call
      let res = await axios.post(
        `${config.API_URL}/api/auth/resetPassword/${params.token}`,
        {
          password,
        }
      );
      console.log(res);
      setMessage("Password reset successful!");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("Failed to reset password");
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-center w-screen h-screen bg-gray-600">
        <div className="w-full md:pt-24 pb-0 max-w-md">
          <div className="bg-gray-800 shadow-md rounded-xl md:px-8 px-4 pb-10 mb-4">
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
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-300 font-semibold text-2xl text-center">
                      Reset Password
                    </p>
                    {error && (
                      <p className="text-red-500 text-center">{error}</p>
                    )}
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
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        <input
                          type="password"
                          placeholder="New Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
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
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
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

export default ResetPassword;
