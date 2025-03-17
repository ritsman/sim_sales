import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../config";

const Activity = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axios.get(
        `${config.API_URL}/api/master/getActivity/`
      );
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedActivities.map((id) =>
          axios.delete(`${config.API_URL}/api/master/deleteActivity/${id}`)
        )
      );
      setActivities(
        activities.filter(
          (activity) => !selectedActivities.includes(activity._id)
        )
      );
      setSelectedActivities([]);
    } catch (error) {
      console.error("Error deleting activities:", error);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedActivities((prev) =>
      prev.includes(id)
        ? prev.filter((activityId) => activityId !== id)
        : [...prev, id]
    );
  };

  const handleEdit = (activity) => {
    navigate("addActivity", { state: { activity } });
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Activities</h2>
        <div>
          <button
            onClick={handleDelete}
            disabled={selectedActivities.length === 0}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mr-2"
          >
            Delete Selected
          </button>
          <button
            onClick={() => navigate("addActivity")}
            className="bg-[#310b6b] text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Activity
          </button>
        </div>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Select</th>
            <th className="border p-2">Activity Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Time (min)</th>
            <th className="border p-2">Cost (₹)</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {activities.length > 0 ? (
            activities.map((activity) => (
              <tr key={activity._id} className="text-center">
                <td className="border p-2">
                  <input
                    type="checkbox"
                    checked={selectedActivities.includes(activity._id)}
                    onChange={() => handleCheckboxChange(activity._id)}
                  />
                </td>
                <td className="border p-2">{activity.activityName}</td>
                <td className="border p-2">{activity.description}</td>
                <td className="border p-2">{activity.time}</td>
                <td className="border p-2">₹{activity.cost}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEdit(activity)}
                    className="bg-blue-900 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-4">
                No activities found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Activity;
