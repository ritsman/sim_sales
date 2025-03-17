import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import config from "../../../config";

const AddGroup1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingGroup = location.state || null;

  const [groupName, setGroupName] = useState("");
  const [type, setType] = useState("");
  const [groups, setGroups] = useState([]);
  const [itemsList, setItemsList] = useState({});
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); // Stores selected items

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        let res = await axios.get(`${config.API_URL}/api/master/getGroup`);
        setGroups(res.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    const fetchItems = async () => {
      try {
        const [activitiesRes, productsRes, sizesRes, itemsRes, processesRes] =
          await Promise.all([
            axios.get(`${config.API_URL}/api/master/getActivity`),
            axios.get(`${config.API_URL}/api/master/getProduct`),
            axios.get(`${config.API_URL}/api/master/getSizes`),
            axios.get(`${config.API_URL}/api/master/getItems`),
            axios.get(`${config.API_URL}/api/master/getProcess`),
          ]);

        setItemsList({
          activity: activitiesRes.data,
          product: productsRes.data,
          size: sizesRes.data,
          item: itemsRes.data,
          process: processesRes.data,
        });

        console.log({
          activity: activitiesRes.data,
          product: productsRes.data,
          size: sizesRes.data,
          item: itemsRes.data,
          process: processesRes.data,
        });
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchGroups();
    fetchItems();
  }, []);

  useEffect(() => {
    if (type) {
      setFilteredOptions(itemsList[type] || []);
    }
  }, [type, itemsList]);

  const addItem = (event) => {
    const selectedId = event.target.value;
    if (!selectedId) return; // Ignore empty selection

    const selectedItem = filteredOptions.find(
      (item) => item._id === selectedId
    );
    if (!selectedItem) return;

    setSelectedItems((prev) => {
      if (!prev.some((selected) => selected._id === selectedItem._id)) {
        return [...prev, selectedItem];
      }
      return prev;
    });
  };

  // **Pre-fill fields when editing**
  useEffect(() => {
    if (editingGroup) {

      console.log(editingGroup)
      setGroupName(editingGroup.groupName);
      setType(editingGroup.under);

      // Load selected items from the editing group
      if (editingGroup.selectedItems) {
        setSelectedItems(editingGroup.selectedItems);
      }
    }
  }, [editingGroup]);

  const removeItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validation
    if (!groupName.trim()) {
      toast.error("Group name is required!");
      return;
    }
    if (!type) {
      toast.error("Please select a type!");
      return;
    }
    if (selectedItems.length === 0) {
      toast.error(`Please add at least one ${type}!`);
      return;
    }

    // Payload to send
    const payload = {
      groupName,
      under: type,
      selectedItems, // Send selected items as array
    };
    console.log(payload);
    try {
      if (editingGroup) {
        // Update existing group
        await axios.put(
          `${config.API_URL}/api/master/updateGroup/${editingGroup.id}`,
          payload
        );
        toast.success("Group updated successfully!");
      } else {
        // Create new group
        await axios.post(`${config.API_URL}/api/master/createGroup`, payload);
        toast.success("New group added successfully!");
      }

      navigate(-1); // Go back after success
    } catch (error) {
      console.error("Error saving group:", error);
      toast.error("Something went wrong. Please try again!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-2xl font-bold mb-8">
          {editingGroup ? "EDIT GROUP" : "ADD GROUP"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto"
        >
          {/* Group Name Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Type Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select Type</option>
              <option value="activity">Activity</option>
              <option value="product">Product</option>
              <option value="item">Item</option>
              <option value="size">Size</option>
              <option value="process">Process</option>
            </select>
          </div>

          {/* Add Dropdown using Select */}
          {/* {type && ( */}
          <div className="mb-4">
            <label className="block font-medium">Add {type}</label>
            <select
              className="w-full border px-3 py-2 rounded"
              onChange={addItem}
              defaultValue=""
            >
              <option value="">Select {type}</option>
              {filteredOptions.map((item) => (
                <option key={item._id} value={item._id}>
                  {type === "activity" && item.activityName}
                  {type === "product" && item.styleName}
                  {type === "size" && item.sizeName}
                  {type === "item" && item.itemName}
                  {type === "process" && item.processName}
                </option>
              ))}
            </select>
          </div>
          {/* )} */}

          {/* Display Selected Items */}
          {selectedItems.length > 0 && (
            <div className="col-span-2 mt-6 mb-5 bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                Selected {type}s
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {selectedItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow-sm border border-gray-300"
                  >
                    {/* Item Name */}
                    <span className="text-gray-800 font-medium">
                      {type === "activity" && item.activityName}
                      {type === "product" && item.styleName}
                      {type === "size" && item.sizeName}
                      {type === "item" && item.itemName}
                      {type === "process" && item.processName}
                    </span>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(index)}
                      className="ml-2 text-red-500 hover:text-red-700 transition duration-200"
                      title="Remove"
                    >
                      ✖
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="col-span-full flex justify-end space-x-4">
            <button
              type="submit"
              className="bg-[#310b6b] hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md"
            >
              {editingGroup ? "Update" : "Submit"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-500 text-white font-semibold py-2 px-6 rounded-md"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGroup1;
