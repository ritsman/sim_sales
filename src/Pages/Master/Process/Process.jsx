import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../config";

const Process = () => {
  const navigate = useNavigate();
  const [processes, setProcesses] = useState([]);
  const [selectedProcesses, setSelectedProcesses] = useState([]);

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/api/master/getProcess`);
        setProcesses(response.data);
      } catch (error) {
        console.error("Error fetching processes:", error);
      }
    };
    fetchProcesses();
  }, []);

  const handleCheckboxChange = (id) => {
    setSelectedProcesses((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedProcesses.map((id) =>
          axios.delete(`${config.API_URL}/api/master/deleteProcess/${id}`)
        )
      );
      setProcesses((prev) =>
        prev.filter((process) => !selectedProcesses.includes(process._id))
      );
      setSelectedProcesses([]);
    } catch (error) {
      console.error("Error deleting processes:", error);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={() => navigate("addProcess")}
        className="mb-4 px-4 py-2 bg-[#310b6b] text-white rounded"
      >
        Add Process
      </button>
      <button
        onClick={handleDelete}
        disabled={selectedProcesses.length === 0}
        className="mb-4 ml-4 px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
      >
        Delete Selected
      </button>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Select</th>
            <th className="border border-gray-300 px-4 py-2">Process Name</th>
            <th className="border border-gray-300 px-4 py-2">Activities</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((process) => (
            <tr key={process._id}>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <input
                  type="checkbox"
                  checked={selectedProcesses.includes(process._id)}
                  onChange={() => handleCheckboxChange(process._id)}
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {process.processName}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {process.activities.map((activity) => (
                  <span
                    key={activity._id}
                    className="inline-block bg-gray-200 px-2 py-1 m-1 rounded"
                  >
                    {activity.activityName}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Process;
