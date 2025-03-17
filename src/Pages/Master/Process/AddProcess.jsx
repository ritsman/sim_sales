import { useEffect, useState } from "react";
import axios from "axios";
import config from "../../../config";
import { useNavigate } from "react-router-dom";

const AddProcess = () => {
  let navigate = useNavigate();
  const [processName, setProcessName] = useState("");
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [activities,setActivity] = useState([
  
  ]);

  const handleAddActivity = (event) => {
    const activityId = (event.target.value);
    console.log(activityId)
    const activity = activities.find((act) => act._id === activityId);
    if (activity && !selectedActivities.some((act) => act._id === activityId)) {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  useEffect(()=>{
     console.log(selectedActivities)
  },[selectedActivities])

  useEffect(()=>{
    let fetchActivity = async()=>{
   try {
    let res = await axios.get(
      `${config.API_URL}/api/master/getActivity/`
    );
    console.log(res.data);
    setActivity(res.data);
    
   } catch (error) {
    console.log(error);
   }
    }
    fetchActivity();
  },[])

  const handleSubmit = async(e) => {
    e.preventDefault();
    const processData = {
      processName,
      activities: selectedActivities,
    };
    console.log("Process Data:", processData);

    try {
      let res = await axios.post(`${config.API_URL}/api/master/addProcess/`,processData);
      console.log(res);
      navigate(-1);
    } catch (error ) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-semibold mb-4">Create Process</h2>
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
          <label className="block font-medium">Add Activity</label>
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
                {activity.activityName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <h3 className="font-medium">Selected Activities:</h3>
          <ul className="list-disc pl-5">
            {selectedActivities.map((activity) => (
              <li key={activity._id}>{activity.activityName}</li>
            ))}
          </ul>
        </div>
        <div className="flex gap-5">
          <button
            type="submit"
            className="w-full bg-[#310b6b] text-white p-2 rounded hover:bg-blue-600"
          >
            Submit Process
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-[#310b6b] text-white p-2 rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProcess;
