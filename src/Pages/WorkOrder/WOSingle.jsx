import { useParams, useNavigate } from "react-router-dom";
import ActivityCard from "./Cards";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import { ArrowLeft } from "lucide-react";

const WorkOrderCards = () => {
  const [workOrder, setWorkOrder] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchWorkOrder = async () => {
    try {
      let res = await axios.get(`${config.API_URL}/api/workorder/getWorkOrder`);
      let obj = res.data.data.find((item) => item._id === id);
      setWorkOrder(obj);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWorkOrder();
  }, [id]);

  if (!workOrder) return <p className="p-6">Work Order not found.</p>;

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-sm text-indigo-600 hover:underline"
      >
        <ArrowLeft size={16} className="mr-1" />
        Go Back
      </button>

      <h2 className="text-2xl font-bold mb-4">{workOrder.workOrderNo}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {workOrder.activityIds?.map((activity) => (
          <ActivityCard key={activity._id} activity={activity} />
        ))}
      </div>
    </div>
  );
};

export default WorkOrderCards;
