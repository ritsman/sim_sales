import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../config";
import { toast } from "react-toastify";

const Unit = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [modifyId, setModifyId] = useState(null);

 

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(
          `${config.API_URL}/api/master/getUnit`
        );
        setGroups([ ...response.data]);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    fetchGroups();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      try {
        await axios.delete(`${config.API_URL}/api/master/deleteUnit/${id}`);
        setGroups(groups.filter((group) => group._id !== id));
        toast.success("Group deleted successfully");
      } catch (error) {
        console.error("Error deleting group:", error);
        toast.error("Failed to delete group");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-2xl font-bold mb-8">UNIT LIST</h1>

        <button
          onClick={() => navigate("addUnit")}
          className="mb-6 px-6 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700"
        >
          Add Unit
        </button>

        <div className="bg-white shadow-md rounded-lg p-6 overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="border px-4 py-2">Unit Name</th>
                <th className="border px-4 py-2">Short Name</th>
                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((unit) => (
                <tr key={unit._id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{unit.unitName}</td>
                  <td className="border px-4 py-2">{unit.shortName}</td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() =>
                        setModifyId(modifyId === unit._id ? null : unit._id)
                      }
                      className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 mr-2"
                    >
                      Modify
                    </button>
                    {modifyId === unit._id && (
                      <>
                        <button
                          onClick={() =>
                            navigate("addUnit", {
                              state: {
                                unitName: unit.unitName,
                                ShortName: unit.shortName,
                                id: unit._id,
                              },
                            })
                          }
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(unit._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Unit;
