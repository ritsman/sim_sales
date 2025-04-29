import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../config";

const Color = () => {
  const navigate = useNavigate();
  const [colors, setColors] = useState([]);
  const [isModify, setIsModify] = useState(false);

  // Fetch sizes from API
  useEffect(() => {
    const fetchColor = async () => {
      try {
        const response = await axios.get(
          `${config.API_URL}/api/master/getColor`
        );
        setColors(response.data);
      } catch (error) {
        console.error("Error fetching colors:", error);
      }
    };
    fetchColor();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Color List</h2>

      {/* Add Size Button */}
      <button
        onClick={() => navigate("addColor")}
        className="mb-4 px-4 py-2 bg-[#310b6b] text-white rounded-lg hover:bg-blue-600"
      >
        Add Color
      </button>

      {/* Size Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Color Name</th>
            <th className="border p-2">Hex Code</th>
            <th className="border p-2">Color</th>

            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {colors.map((color) => (
            <tr key={color._id} className="border text-center">
              <td className="border p-2">{color.colorName}</td>
              <td className="border p-2">{color.hex}</td>
              <td className="border p-2">
                {" "}
                <div
                  className="w-8 h-8 mx-auto rounded-full border border-gray-400"
                  style={{ backgroundColor: color.hex }}
                ></div>
              </td>

              <td className="border p-2">
                <button
                  onClick={async () => {
                    setIsModify(!isModify);
                  }}
                  className="px-3 py-1 mr-2 bg-[#310b6b] text-white rounded-lg hover:bg-blue-600"
                >
                  Modify
                </button>
                {isModify && (
                  <button
                    onClick={() =>
                      navigate("addColor", {
                        state: {
                          colorName: color.colorName,
                          hex: color.hex,
                          id: color._id,
                        },
                      })
                    }
                    className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 mr-2"
                  >
                    Edit
                  </button>
                )}
                {isModify && (
                  <button
                    onClick={async () => {
                      if (window.confirm("Are you sure you want to delete?")) {
                        await axios.delete(
                          `${config.API_URL}/api/master/deleteColor/${color._id}`
                        );
                        setColors(colors.filter((s) => s._id !== color._id));
                      }
                    }}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Color;
