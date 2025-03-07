import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import config from "../../../config";
import { toast } from "react-toastify";

const AddUnit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingUnit = location.state || null; // Get passed unit details if editing

  const [unitName, setUnitName] = useState("");
  const [shortName, setShortName] = useState("");

  useEffect(() => {
    if (editingUnit) {
        console.log(editingUnit)
      setUnitName(editingUnit.unitName);
      setShortName(editingUnit.ShortName);
    }
  }, [editingUnit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { unitName, shortName };

    try {
      if (editingUnit?.id) {
        // Update existing unit
        await axios.put(
          `${config.API_URL}/api/master/updateUnit/${editingUnit.id}`,
          payload
        );
        toast.success("Unit updated successfully!");
      } else {
        // Add new unit
        await axios.post(`${config.API_URL}/api/master/createUnit`, payload);
        toast.success("New Unit added successfully!");
      }
      navigate(-1); // Go back after submission
    } catch (error) {
      console.error("Error saving unit:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-2xl font-bold mb-8">
          {editingUnit ? "EDIT UNIT" : "ADD UNIT"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Unit Name Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit Name
              </label>
              <input
                type="text"
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Short Name Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Name
              </label>
              <input
                type="text"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Buttons */}
            <div className="col-span-full flex justify-end space-x-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md"
              >
                {editingUnit ? "Update" : "Submit"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-md"
              >
                Back
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUnit;
