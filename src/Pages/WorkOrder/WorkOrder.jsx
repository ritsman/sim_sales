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
    processId: "",
    activityIds: [],
    inputs: [],
    outputs: [],
  });

  const [showInputDropdown, setShowInputDropdown] = useState(false);
  const [showOutputDropdown, setShowOutputDropdown] = useState(false);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add state to track which dropdown tab is active
  const [activeInputTab, setActiveInputTab] = useState("items");
  const [activeOutputTab, setActiveOutputTab] = useState("products");

  useEffect(() => {
    generateWorkOrderNo();
    fetchData();
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
    try {
      // Fetch the last work order number from the database
      const response = await axios.get(
        `${config.API_URL}/api/workorder/lastOrderNo`
      );
      console.log(response);
      return response.data.lastOrderNo; // Default if none exists
    } catch (error) {
      console.error("Error fetching last order number:", error);
      return "WO2500001"; // Default fallback
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productRes, itemRes, processRes, groupRes] = await Promise.all([
        axios.get(`${config.API_URL}/api/master/getProduct`),
        axios.get(`${config.API_URL}/api/master/getItems`),
        axios.get(`${config.API_URL}/api/master/getProcess`),
        axios.get(`${config.API_URL}/api/master/getGroup`),
      ]);

      const processGroup = groupRes.data.filter(
        (item) => item.type === "process"
      );

      setProducts(productRes.data);
      setItems(itemRes.data);

      // Combine processes with process groups
      // Each process already has its activities embedded
      const allProcesses = [...processRes.data];
      setProcesses(allProcesses);

      // We don't need to fetch activities separately since they're embedded in processes
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // If process changes, use embedded activities from the process document
    if (name === "processId") {
      const selectedProcess = processes.find((p) => p._id === value);
      if (
        selectedProcess &&
        selectedProcess.activities &&
        Array.isArray(selectedProcess.activities)
      ) {
        // Use activities directly from the process document
        setFilteredActivities(selectedProcess.activities);
      } else {
        setFilteredActivities([]);
      }
      // Reset selected activities when process changes
      setFormData((prev) => ({ ...prev, activityIds: [] }));
    }
  };

  const handleActivitySelect = (activity) => {
    setFormData((prev) => {
      const activityExists = prev.activityIds.some(
        (item) => item._id === activity._id
      );

      if (activityExists) {
        // Remove the activity if it already exists
        return {
          ...prev,
          activityIds: prev.activityIds.filter(
            (item) => item._id !== activity._id
          ),
        };
      } else {
        // Add the whole activity object
        return {
          ...prev,
          activityIds: [...prev.activityIds, activity],
        };
      }
    });
  };

  const addItem = (type, item) => {
    const itemExists = formData[type].some(
      (existingItem) => existingItem._id === item._id
    );

    if (!itemExists) {
      // Add debugging to see what's being added
      console.log("Adding to", type, item);
      setFormData((prev) => ({ ...prev, [type]: [...prev[type], item] }));
    }
  };

  const removeItem = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    console.log(formData);
    try {
      setLoading(true);
      // Send the entire form data with full objects
      const response = await axios.post(
        `${config.API_URL}/api/workorder/createWorkOrder`,
        formData
      );
      console.log(response);

      alert("Work order created successfully!");
      navigate(-1); // Go back after successful creation

      setLoading(false);
    } catch (error) {
      console.error("Error creating work order:", error);
      alert(
        "Error creating work order: " +
          (error.response?.data?.message || error.message)
      );
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Create Work Order</h2>

      {loading && <div className="text-center py-4">Loading...</div>}

      <form className="grid grid-cols-2 gap-4">
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

        {/* Process Selection */}
        <div className="col-span-2">
          <label className="block font-medium">Process</label>
          <select
            name="processId"
            value={formData.processId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Process</option>
            {processes.map((process) => (
              <option key={process._id} value={process._id}>
                {process.processName}
              </option>
            ))}
          </select>
        </div>

        {/* Activities Section - shows activities related to selected process */}
        {formData.processId && (
          <div className="col-span-2 mt-4">
            <label className="block font-medium mb-2">
              Activities for Selected Process
            </label>
            <div className="border rounded-md p-4 bg-gray-50">
              {filteredActivities.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {filteredActivities.map((activity) => (
                    <div key={activity._id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`activity-${activity._id}`}
                        checked={formData.activityIds.some(
                          (item) => item._id === activity._id
                        )}
                        onChange={() => handleActivitySelect(activity)}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`activity-${activity._id}`}
                        className="cursor-pointer"
                      >
                        {activity.activityName}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  No activities available for the selected process.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Input Items */}
        <div className="col-span-2 mt-2">
          <label className="block font-medium">Input Materials</label>
          <div className="relative">
            <input
              type="text"
              onFocus={() => setShowInputDropdown(true)}
              onBlur={() => setTimeout(() => setShowInputDropdown(false), 200)}
              className="w-full border px-3 py-2 rounded"
              placeholder="Click to add input materials"
            />
            {showInputDropdown && (
              <div className="border mt-1 bg-white shadow-md rounded max-h-60 overflow-y-auto absolute w-full z-10 bg-white">
                <div className="flex border-b">
                  <button
                    type="button"
                    className={`flex-1 py-2 ${
                      activeInputTab === "items"
                        ? "bg-blue-100 font-medium"
                        : ""
                    }`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setActiveInputTab("items");
                    }}
                  >
                    Items
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 ${
                      activeInputTab === "products"
                        ? "bg-blue-100 font-medium"
                        : ""
                    }`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setActiveInputTab("products");
                    }}
                  >
                    Products
                  </button>
                </div>

                {activeInputTab === "items" && (
                  <ul>
                    {items.map((item) => (
                      <li
                        key={item._id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          addItem("inputs", item);
                        }}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                      >
                        <span className="font-medium">{item.itemName}</span>{" "}
                        <span className="text-sm text-gray-500">(Item)</span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeInputTab === "products" && (
                  <ul>
                    {products.map((product) => (
                      <li
                        key={product._id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          addItem("inputs", product);
                        }}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                      >
                        <span className="font-medium">{product.styleName}</span>{" "}
                        <span className="text-sm text-gray-500">(Product)</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          <ul className="list-disc pl-5 mt-2">
            {formData.inputs.map((input, index) => (
              <li key={index} className="flex justify-between">
                {input.itemName ? input.itemName : input.styleName}
                {input.itemName ? (
                  <span className="text-xs text-gray-500 mr-2">(Item)</span>
                ) : (
                  <span className="text-xs text-gray-500 mr-2">(Product)</span>
                )}
                <button
                  type="button"
                  onClick={() => removeItem("inputs", index)}
                  className="text-red-500"
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Output Items */}
        <div className="col-span-2">
          <label className="block font-medium">Output Materials</label>
          <div className="relative">
            <input
              type="text"
              onFocus={() => setShowOutputDropdown(true)}
              onBlur={() => setTimeout(() => setShowOutputDropdown(false), 200)}
              className="w-full border px-3 py-2 rounded"
              placeholder="Click to add output materials"
            />
            {showOutputDropdown && (
              <div className="border mt-1 bg-white shadow-md rounded max-h-60 overflow-y-auto absolute w-full z-10 bg-white">
                <div className="flex border-b">
                  <button
                    type="button"
                    className={`flex-1 py-2 ${
                      activeOutputTab === "items"
                        ? "bg-blue-100 font-medium"
                        : ""
                    }`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setActiveOutputTab("items");
                    }}
                  >
                    Items
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 ${
                      activeOutputTab === "products"
                        ? "bg-blue-100 font-medium"
                        : ""
                    }`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setActiveOutputTab("products");
                    }}
                  >
                    Products
                  </button>
                </div>

                {activeOutputTab === "items" && (
                  <ul>
                    {items.map((item) => (
                      <li
                        key={item._id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          addItem("outputs", item);
                        }}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                      >
                        <span className="font-medium">{item.itemName}</span>{" "}
                        <span className="text-sm text-gray-500">(Item)</span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeOutputTab === "products" && (
                  <ul>
                    {products.map((product) => (
                      <li
                        key={product._id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          addItem("outputs", product);
                        }}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                      >
                        <span className="font-medium">{product.styleName}</span>{" "}
                        <span className="text-sm text-gray-500">(Product)</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          <ul className="list-disc pl-5 mt-2">
            {formData.outputs.map((output, index) => (
              <li key={index} className="flex justify-between">
                {output.itemName ? output.itemName : output.styleName}
                {output.itemName ? (
                  <span className="text-xs text-gray-500 mr-2">(Item)</span>
                ) : (
                  <span className="text-xs text-gray-500 mr-2">(Product)</span>
                )}
                <button
                  type="button"
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

      <div className="flex gap-5 mt-6">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          {loading ? "Creating..." : "Create Work Order"}
        </button>
        <button
          onClick={() => navigate(-1)}
          disabled={loading}
          className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-300"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default WorkOrder;
