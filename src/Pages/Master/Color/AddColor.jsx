import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../config";

const AddColor = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Provide safe default values to prevent undefined errors
  const initialData = location.state || { colorName: "", hex :"", id: null };

  // State Variables
  const [colorName, setColorName] = useState(initialData.colorName);
  const [hex, setHex] = useState(initialData.hex);

  // ✅ Only update state when component mounts (no dependencies)
  useEffect(() => {
    if (!location.state) {
      setColorName("");
      setHex([]);
    }
  }, []); // ✅ Empty dependency array prevents infinite re-renders.



  // Handle form submission (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData.id) {
        // Update existing entry
        await axios.put(
          `${config.API_URL}/api/master/updateColor/${initialData.id}`,
          {
            colorName,
            hex,
          }
        );
        alert("color updated successfully!");
      } else {
        // Create new entry
        await axios.post(`${config.API_URL}/api/master/createColor`, {
          colorName,
          hex,
        });
        alert("color added successfully!");
      }
      navigate(-1); // Redirect to size list
    } catch (error) {
      console.error("Error saving color:", error);
      alert("Failed to save!");
    }
  };

 

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">
        {initialData.id ? "Edit Color" : "Add Color"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold text-gray-600 mb-1">
            Color Name
          </label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-300"
            value={colorName}
            onChange={(e) => setColorName(e.target.value)}
          />
        </div>

        {/* Dynamic Size Inputs */}
        <div className="mb-4">
          <label className="block font-semibold text-gray-600 mb-1">
            Hex Code
          </label>
        
              <input
                type="text"
                className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-300"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                placeholder={`Enter Hex Code`}
              />
          </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-[#310b6b] text-white rounded-lg hover:bg-blue-600"
          >
            Back
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-[#310b6b] text-white rounded-lg hover:bg-blue-600"
          >
            {initialData.id ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddColor;
