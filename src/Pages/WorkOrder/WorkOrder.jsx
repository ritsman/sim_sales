import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config";

const WorkOrder = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    workOrderNo: "",
    startTime: "",
    endTime: "",
    activity: "",
    group: "",
    process: "",
    inputs: [],
    outputs: [],
  });

  const [showInputDropdown, setShowInputDropdown] = useState(false);
  const [showOutputDropdown, setShowOutputDropdown] = useState(false);
  const [products , setProducts] = useState([]);
  const [items , setItems ]= useState([]);

   useEffect(() => {
     generateWorkOrderNo();
   }, []);

   const generateWorkOrderNo = async () => {
     const currentYear = new Date().getFullYear().toString().slice(-2);
     const lastOrderNo = await getLastWorkOrderNo();
     const newOrderNo = lastOrderNo ? parseInt(lastOrderNo.slice(4)) + 1 : 1;
     const formattedOrderNo = `WO${currentYear}${newOrderNo
       .toString()
       .padStart(5, "0")}`;
     setFormData((prev) => ({ ...prev, workOrderNo: formattedOrderNo }));
   };

    const getLastWorkOrderNo = async () => {
      // Fetch the last work order number from the database/API
      // Placeholder: Replace with an actual API call
      return "WO2500001"; // Example last order number
    };

  const activities = ["Activity 1", "Activity 2", "Activity 3"];
  const groups = ["Group A", "Group B", "Group C"];
  const processes = ["Process X", "Process Y", "Process Z"];
  const availableItems = ["Item 1", "Item 2", "Item 3", "Item 4"];

  useEffect(()=>{
      const fetchdata = async()=>{
            try {
                let productRes = await axios.get(
                  `${config.API_URL}/api/master/getProduct`
                );
                  let itemRes = await axios.get(
                    `${config.API_URL}/api/master/getItems`
                  );

                  setProducts(productRes.data);
                  setItems(itemRes.data);
                  console.log(productRes,itemRes)
            } catch (error) {
                console.log(error);
            }
      }
      fetchdata();
  },[])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addItem = (type, item) => {
    if (!formData[type].includes(item)) {
      setFormData((prev) => ({ ...prev, [type]: [...prev[type], item] }));
    }
  };

  const removeItem = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Create Work Order</h2>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="grid grid-cols-2 gap-4"
      >
        <div className="col-span-2">
          <label className="block font-semibold text-gray-600 mb-1">
            Work Order No
          </label>
          <input
            type="text"
            name="workOrderNo"
            value={formData.workOrderNo}
            readOnly
            className="w-[50%] border px-4 py-3 rounded-lg shadow-sm bg-gray-100 text-gray-700"
          />
        </div>
        {/* Row 1: Start Time & End Time */}
        <div>
          <label className="block font-medium">Start Time</label>
          <input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">End Time</label>
          <input
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Row 2: Process, Group, and Activity */}
        <div>
          <label className="block font-medium">Process</label>
          <select
            name="process"
            value={formData.process}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Process</option>
            {processes.map((process, index) => (
              <option key={index} value={process}>
                {process}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">Group</label>
          <select
            name="group"
            value={formData.group}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Group</option>
            {groups.map((group, index) => (
              <option key={index} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">Activity</label>
          <select
            name="activity"
            value={formData.activity}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Activity</option>
            {activities.map((activity, index) => (
              <option key={index} value={activity}>
                {activity}
              </option>
            ))}
          </select>
        </div>

        {/* Row 3: Input and Output Items */}
        <div className="col-span-2">
          <label className="block font-medium">Input </label>
          <input
            type="text"
            onFocus={() => setShowInputDropdown(true)}
            onBlur={() => setTimeout(() => setShowInputDropdown(false), 200)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Click to add input items"
          />
          {showInputDropdown && (
            <ul className="border mt-1 bg-white shadow-md rounded">
              {items.map((item, index) => (
                <li
                  key={index}
                  onMouseDown={() => addItem("inputs", item)}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                >
                  {item.itemName}
                </li>
              ))}
            </ul>
          )}
          <ul className="list-disc pl-5 mt-2">
            {formData.inputs.map((input, index) => (
              <li key={index} className="flex justify-between">
                {input.itemName}
                <button
                  onClick={() => removeItem("inputs", index)}
                  className="text-red-500"
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2">
          <label className="block font-medium">Output </label>
          <input
            type="text"
            onFocus={() => setShowOutputDropdown(true)}
            onBlur={() => setTimeout(() => setShowOutputDropdown(false), 200)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Click to add output items"
          />
          {showOutputDropdown && (
            <ul className="border mt-1 bg-white shadow-md rounded">
              {products.map((item, index) => (
                <li
                  key={index}
                  onMouseDown={() => addItem("outputs", item)}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                >
                  {item.styleName}
                </li>
              ))}
            </ul>
          )}
          <ul className="list-disc pl-5 mt-2">
            {formData.outputs.map((output, index) => (
              <li key={index} className="flex justify-between">
                {output.styleName}
                <button
                  onClick={() => removeItem("outputs", index)}
                  className="text-red-500"
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
        </div>
      </form>
      <div className="flex gap-5">
        <button className="px-6 py-2 mt-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
          Create WorkOrder
        </button>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 mt-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default WorkOrder;
