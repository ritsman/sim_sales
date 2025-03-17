import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../config";
import { toast } from "react-toastify";

const Group1 = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [modifyId, setModifyId] = useState(null);

  const options2 = [
    { _id: 1, code: "A1000", groupName: "group1", under: "Primary" },
    { _id: 2, code: "B1000", groupName: "group2", under: "Primary" },
  ];

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(
          `${config.API_URL}/api/master/getGroup`
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
        await axios.delete(`${config.API_URL}/api/master/deleteGroup/${id}`);
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
        <h1 className="text-center text-2xl font-bold mb-8">GROUP LIST</h1>

        <button
          onClick={() => navigate("addGroup")}
          className="mb-6 px-6 py-2 bg-[#310b6b] text-white font-semibold rounded-md hover:bg-blue-700"
        >
          Add Group
        </button>

        <div className="bg-white shadow-md rounded-lg p-6 overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="border px-4 py-2">Group Name</th>
                <th className="border px-4 py-2">Type</th>
                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr key={group._id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{group.groupName}</td>
                  <td className="border px-4 py-2">{group.under}</td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() =>
                        setModifyId(modifyId === group._id ? null : group._id)
                      }
                      className="px-3 py-1 bg-[#310b6b] text-white rounded-lg hover:bg-blue-600 mr-2"
                    >
                      Modify
                    </button>
                    {modifyId === group._id && (
                      <>
                        <button
                          onClick={() =>
                            navigate("addGroup", {
                              state: {
                                groupName: group.groupName,
                                under: group.under,
                                selectedItems:group.selectedItems,
                                id: group._id,
                              },
                            })
                          }
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(group._id)}
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

export default Group1;
