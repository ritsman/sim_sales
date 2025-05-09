import { Clock, IndianRupee, Users } from "lucide-react";

export default function ActivityCard({ activity }) {
  // Function to generate random progress percentage for demo purposes
  const getRandomProgress = () => {
    return Math.floor(Math.random() * 100) + 1;
  };

  // Calculate progress value once per component render
  const progressValue = getRandomProgress();

  return (
    <div className="border rounded-2xl p-6 shadow-md bg-gradient-to-r from-white to-gray-50 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between">
        <h3 className="text-xl font-semibold text-indigo-600 mb-2">
          {activity.activityName}
        </h3>
        <div>
            <button className="px-2 py-1 text-white hover:bg-gray-500 rounded-md bg-gray-600">
                Add Data Entry
            </button>
        </div>
      </div>

      <p className="text-gray-600 mb-3">{activity.description}</p>

      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-indigo-500" />
          <span>
            Time: <span className="font-medium">{activity.time} min</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <IndianRupee size={16} className="text-green-500" />
          <span>
            Cost: <span className="font-medium">₹{activity.cost}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Users size={16} className="text-blue-500" />
          <span>
            Group: <span className="font-medium">{activity.group}</span>
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-indigo-600">
              Progress
            </span>
            <span className="text-sm font-medium">{progressValue}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressValue}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
