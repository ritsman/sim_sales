import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";
import { useNavigate } from "react-router-dom";
import { set } from "lodash";
import { Link } from "react-router-dom";

const WorkflowBoard = () => {
  const navigate = useNavigate();
  const [workOrders, setWorkOrders] = useState([]);

  const fetchWorkOrder = async () => {
    try {
      let res = await axios.get(`${config.API_URL}/api/workorder/getWorkOrder`);
      console.log(res);

      setWorkOrders(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWorkOrder();
  }, []);

  // Function to generate random progress percentage for demo purposes
  const getRandomProgress = () => {
    return Math.floor(Math.random() * 100) + 1;
  };

  return (
    <div className="px-10">
      <div>
        <button
          onClick={() => navigate("createWorkOrder")}
          className="px-6 py-2 mb-5 bg-[#310b6b] text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Create WorkOrder
        </button>
      </div>
      <div className="grid gap-4">
        {workOrders.map((wo) => {
          // Store the random progress value in a variable for each work order
          const progressValue = getRandomProgress();

          return (
            <Link
              to={`/workorder/${wo._id}`}
              key={wo._id}
              className="border rounded-lg p-4 hover:bg-gray-100"
            >
              <h3 className="text-lg font-semibold">{wo.workOrderNo}</h3>
              <div className="flex justify-between">
                <div>
                  <p>
                    Start: {new Date(wo.startTime).toLocaleString()} <br />
                    End: {new Date(wo.endTime).toLocaleString()}
                  </p>
                </div>
                <div>
                  <button className="px-2 py-1 text-white hover:bg-gray-500 rounded-md bg-gray-600">
                    Add Data Entry
                  </button>
                </div>
              </div>

              {/* Progress Bar - using the local progressValue variable */}
              <div className="mt-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-medium">{progressValue}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${progressValue}%` }}
                  ></div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default WorkflowBoard;
