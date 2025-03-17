import axios from "axios";
import { useState, useEffect } from "react";
import config from "../../../config";
import { useNavigate, useLocation } from "react-router-dom";

const AddActivity = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    activityName: "",
    description: "",
    time: "",
    cost: "",
  });

  useEffect(() => {
    if (location.state?.activity) {
      setFormData(location.state.activity);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData._id) {
        await axios.put(
          `${config.API_URL}/api/master/updateActivity/${formData._id}`,
          formData
        );
      } else {
        await axios.post(`${config.API_URL}/api/master/addActivity/`, formData);
      }
      navigate(-1);
    } catch (error) {
      console.error("Error submitting activity:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">
        {formData._id ? "Edit Activity" : "Add Activity"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">
            Activity Name
          </label>
          <input
            type="text"
            name="activityName"
            value={formData.activityName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700 font-medium">
            Time (minutes)
          </label>
          <input
            type="number"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Cost (₹)</label>
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex gap-5">
          <button
            type="submit"
            className="w-full bg-[#310b6b] text-white py-2 rounded-md hover:bg-blue-600"
          >
            {formData._id ? "Update" : "Submit"}
          </button>
          <button
            onClick={() => navigate("/master/activity")}
            className="w-full bg-[#310b6b] text-white py-2 rounded-md hover:bg-blue-600"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddActivity;
