import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import config from "../../../config";
import { useNavigate } from "react-router-dom";

// This would be your actual unit component or a function that fetches units
const fetchUnits = async () => {
  // In a real implementation, this would come from your backend or state management
  let result = [];

  try {
    let res = await axios.get(`${config.API_URL}/api/master/getUnit`);
    console.log(res.data);
    result = [...res.data];
  } catch (error) {
    console.log(error);
  }

  return result;
};

const AddItems = () => {
  const [units, setUnits] = useState([]);
  const location = useLocation();
  const editingItem = location.state?.item || null; // Check if editing
  const isEditing = !!editingItem;
  const [image , setImage] = useState(null);
  const [previewImage, setPreviewImage]  = useState(null)
  const [formData, setFormData] = useState({
    itemName: "",
    itemType: "",
    itemColor: "0",
    itemSelect: "",
    gst: "",
    hsnCode: "",
    rate: "0",
    issueUnit: "",
    bufferUnit: "0",
    openingStock: "0",
    purchaseUnit: "",
    purchaseIssueRatio: "0",
    moq: "0",
    msc1: "",
    msc2: "",
    specification: "0",
    user: "",

  });

  const navigate = useNavigate();

  useEffect(() => {
    // Load units when component mounts
    const loadUnits = async () => {
      const fetchedUnits = await fetchUnits();
      setUnits(fetchedUnits);
    };

    loadUnits();
  }, []);

  useEffect(() => {
    // If editing, populate the form with the item data
    if (editingItem) {
      setFormData((prevData) => ({
        ...prevData,
        ...editingItem,
        // Make sure to use the IDs for unit select fields if they exist
        issueUnit: editingItem.issueUnit?._id || editingItem.issueUnit || "",
        purchaseUnit:
          editingItem.purchaseUnit?._id || editingItem.purchaseUnit || "",
      }));
       if (editingItem.image) {
         setPreviewImage(`${config.API_URL}${editingItem.image}`);
       }
    }
  }, [editingItem]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleUnitChange = (e) => {
    const { id, value } = e.target;
    // Find the selected unit to store both name and shortName
    const selectedUnit = units.find((unit) => unit._id.toString() === value);

    setFormData({
      ...formData,
      [id]: value,
      // Store the actual unit details in a separate field
      [`${id}Details`]: selectedUnit,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    if (image) {
      formDataToSend.append("image", image);
    }
     console.log("FormData entries:");
     for (let pair of formDataToSend.entries()) {
       console.log(pair[0], pair[1]);
     }
    try {
      if (editingItem) {
        await axios.put(
          `${config.API_URL}/api/master/updateItems/${editingItem._id}`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        await axios.post(
          `${config.API_URL}/api/master/createItems`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }
      navigate(-1);
    } catch (error) {
      console.log(error);
      // You might want to add error handling here
      alert("Error " + (isEditing ? "updating" : "creating") + " item");
    }
  };

  // Handle image selection
  const handleImageChange = (e, fieldName) => {
    const file = e.target.files[0];
    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? "Edit Item" : "Add New Item"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Row 1 */}
        <div className="space-y-2">
          <label htmlFor="itemName" className="block text-gray-700 font-medium">
            Item Name
          </label>
          <input
            type="text"
            id="itemName"
            value={formData.itemName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="itemType" className="block text-gray-700 font-medium">
            Item Type
          </label>
          <input
            type="text"
            id="itemType"
            placeholder="Item Type*"
            value={formData.itemType}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="itemColor"
            className="block text-gray-700 font-medium"
          >
            Item Color
          </label>
          <input
            type="text"
            id="itemColor"
            value={formData.itemColor}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Row 2 */}
        <div className="space-y-2">
          <label
            htmlFor="itemSelect"
            className="block text-gray-700 font-medium"
          >
            Item Select
          </label>
          <input
            type="text"
            id="itemSelect"
            placeholder="Item Select*"
            value={formData.itemSelect}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="gst" className="block text-gray-700 font-medium">
            GST
          </label>
          <input
            type="text"
            id="gst"
            placeholder="GST*"
            value={formData.gst}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="hsnCode" className="block text-gray-700 font-medium">
            HSN Code
          </label>
          <input
            type="text"
            id="hsnCode"
            placeholder="HSN_Code*"
            value={formData.hsnCode}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Row 3 */}
        <div className="space-y-2">
          <label htmlFor="rate" className="block text-gray-700 font-medium">
            Price
          </label>
          <input
            type="text"
            id="rate"
            value={formData.rate}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Issue Unit Dropdown */}
        <div className="space-y-2">
          <label
            htmlFor="issueUnit"
            className="block text-gray-700 font-medium"
          >
            Issue Unit
          </label>
          <select
            id="issueUnit"
            value={formData.issueUnit}
            onChange={handleUnitChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Issue Unit*</option>
            {units.map((unit) => (
              <option key={unit._id} value={unit.unitName}>
                {unit.unitName} ({unit.shortName})
              </option>
            ))}
          </select>
          {formData.issueUnitDetails && (
            <div className="text-sm text-gray-500">
              Selected: {formData.issueUnitDetails.unitName} (
              {formData.issueUnitDetails.shortName})
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="bufferUnit"
            className="block text-gray-700 font-medium"
          >
            Buffer Unit
          </label>
          <input
            type="text"
            id="bufferUnit"
            value={formData.bufferUnit}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Row 4 */}
        <div className="space-y-2">
          <label
            htmlFor="openingStock"
            className="block text-gray-700 font-medium"
          >
            Opening Stock
          </label>
          <input
            type="text"
            id="openingStock"
            value={formData.openingStock}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Purchase Unit Dropdown */}
        <div className="space-y-2">
          <label
            htmlFor="purchaseUnit"
            className="block text-gray-700 font-medium"
          >
            Purchase Unit
          </label>
          <select
            id="purchaseUnit"
            value={formData.purchaseUnit}
            onChange={handleUnitChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Purchase Unit*</option>
            {units.map((unit) => (
              <option key={unit._id} value={unit.unitName}>
                {unit.unitName} ({unit.shortName})
              </option>
            ))}
          </select>
          {formData.purchaseUnitDetails && (
            <div className="text-sm text-gray-500">
              Selected: {formData.purchaseUnitDetails.unitName} (
              {formData.purchaseUnitDetails.shortName})
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="purchaseIssueRatio"
            className="block text-gray-700 font-medium"
          >
            Purchase Issue Ratio
          </label>
          <input
            type="text"
            id="purchaseIssueRatio"
            value={formData.purchaseIssueRatio}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Rest of the form continues as before */}
        <div className="space-y-2">
          <label htmlFor="moq" className="block text-gray-700 font-medium">
            MOQ
          </label>
          <input
            type="text"
            id="moq"
            value={formData.moq}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="msc1" className="block text-gray-700 font-medium">
            MSC1
          </label>
          <input
            type="text"
            id="msc1"
            placeholder="Msc1*"
            value={formData.msc1}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="msc2" className="block text-gray-700 font-medium">
            MSC2
          </label>
          <input
            type="text"
            id="msc2"
            placeholder="Msc2*"
            value={formData.msc2}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="specification"
            className="block text-gray-700 font-medium"
          >
            Specification
          </label>
          <input
            type="text"
            id="specification"
            value={formData.specification}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="user" className="block text-gray-700 font-medium">
            User
          </label>
          <input
            type="text"
            id="user"
            placeholder="User*"
            value={formData.user}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-600">
            Product Image 3
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, "image")}
            className="block w-full text-sm text-gray-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-lg file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-blue-50 file:text-blue-700
                                  hover:file:bg-blue-100 cursor-pointer"
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="mt-4 h-32 w-32 object-cover rounded"
            />
          )}
        </div>

        {/* Submit Button */}
        <div className="md:col-span-3 flex gap-5 mt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isEditing ? "Update Item" : "Save Item"}
          </button>
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItems;
