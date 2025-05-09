import { useEffect, useState } from "react";
import axios from "axios";
import config from "../../../config";
import { useNavigate, useParams } from "react-router-dom";

const EditProcess = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [processName, setProcessName] = useState("");
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [processGroup, setProcessGroup] = useState("");
  const [activities, setActivities] = useState([]);
  const [activityGroups, setActivityGroups] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the specific process data
  useEffect(() => {
    const fetchProcessData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${config.API_URL}/api/master/getProcess/${id}`
        );

        console.log(response)
        const process = response.data;

        setProcessName(process?.processName || "");
        setProcessGroup(process?.group || "");
        setSelectedActivities(process?.activities || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching process data:", error);
        setIsLoading(false);
      }
    };

    fetchProcessData();
  }, [id]);

  // Fetch categories (process groups)
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const categoryRes = await axios.get(
          `${config.API_URL}/api/master/getGroup`
        );
        setCategories([...categoryRes.data]);
      } catch (err) {
        console.log(err);
      }
    };
    fetchGroup();
  }, []);

  // Fetch activities and organize them by group
  useEffect(() => {
    let fetchActivity = async () => {
      try {
        let res = await axios.get(`${config.API_URL}/api/master/getActivity/`);
        setActivities(res.data);
        console.log(res);

        // Organize activities by group for easy selection
        const groups = {};
        res.data.forEach((activity) => {
          if (!groups[activity.group]) {
            groups[activity.group] = [];
          }
          groups[activity.group].push(activity);
        });
        setActivityGroups(groups);
      } catch (error) {
        console.log(error);
      }
    };
    fetchActivity();
  }, []);

  const handleAddActivity = (event) => {
    const activityId = event.target.value;
    if (!activityId) return;

    const activity = activities.find((act) => act._id === activityId);
    if (activity && !selectedActivities.some((act) => act._id === activityId)) {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  const handleAddActivityGroup = (event) => {
    const groupName = event.target.value;
    if (!groupName) return;

    const activitiesInGroup = activityGroups[groupName] || [];

    // Filter out activities that are already selected
    const newActivities = activitiesInGroup.filter(
      (activity) => !selectedActivities.some((act) => act._id === activity._id)
    );

    if (newActivities.length > 0) {
      setSelectedActivities([...selectedActivities, ...newActivities]);
    }
  };

  const removeActivity = (activityId) => {
    setSelectedActivities(
      selectedActivities.filter((activity) => activity._id !== activityId)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const processData = {
      processName,
      activities: selectedActivities,
      group: processGroup,
    };

    try {
      await axios.put(
        `${config.API_URL}/api/master/updateProcess/${id}`,
        processData
      );
      navigate(-1);
    } catch (error) {
      console.error("Error updating process:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-medium">Loading process data...</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-semibold mb-4">Edit Process</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium">Process Name</label>
          <input
            type="text"
            value={processName}
            onChange={(e) => setProcessName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">
            Process Group
          </label>
          <select
            className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-300"
            value={processGroup}
            onChange={(e) => setProcessGroup(e.target.value)}
            name="processGroup"
          >
            <option value="">Select process group</option>
            {categories.map((cat) => {
              if (cat.type === "process") {
                return (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                );
              }
              return null;
            })}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-medium">Add Activity By Group</label>
          <select
            className="w-full p-2 border rounded mb-2"
            onChange={handleAddActivityGroup}
            defaultValue=""
          >
            <option value="">Select an activity group</option>
            {Object.keys(activityGroups).map((group) => (
              <option key={group} value={group}>
                {group} ({activityGroups[group].length} activities)
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-medium">Add Individual Activity</label>
          <select
            className="w-full p-2 border rounded"
            onChange={handleAddActivity}
            defaultValue=""
          >
            <option value="" disabled>
              Select an activity
            </option>
            {activities.map((activity) => (
              <option key={activity._id} value={activity._id}>
                {activity.activityName} (Group: {activity.group})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <h3 className="font-medium">Selected Activities:</h3>
          {selectedActivities.length === 0 ? (
            <p className="text-gray-500 italic">No activities selected</p>
          ) : (
            <ul className="list-disc pl-5">
              {selectedActivities.map((activity) => (
                <li
                  key={activity._id}
                  className="flex justify-between items-center"
                >
                  <span>
                    {activity.activityName} - Group: {activity.group}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeActivity(activity._id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-5">
          <button
            type="submit"
            className="w-full bg-[#310b6b] text-white p-2 rounded hover:bg-blue-600"
          >
            Update Process
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full bg-[#310b6b] text-white p-2 rounded hover:bg-blue-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProcess;
