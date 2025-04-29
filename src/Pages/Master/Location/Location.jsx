import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../config";

const Location = () => {
  const navigate = useNavigate();
  const [parties, setParties] = useState([]);
  const [expandedParty, setExpandedParty] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/api/master/getLocations`);
        setParties(response.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  const toggleExpand = (partyId) => {
    setExpandedParty(expandedParty === partyId ? null : partyId);
  };

  const handleDelete = async (partyId) => {
    if (window.confirm("Are you sure you want to delete this party?")) {
      try {
        await axios.delete(`${config.API_URL}/api/master/deleteLocation/${partyId}`);
        setParties(parties.filter((party) => party.partyId !== partyId));
      } catch (error) {
        console.error("Error deleting party:", error);
      }
    }
  };

  const handleUpdate = (party) => {
    navigate("addLocation", { state: party });
  };

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => navigate("addLocation")}
        className="bg-blue-900 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Add Location
      </button>
      <div className="mt-6 bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-300 text-black">
            <tr>
              <th className="p-4 text-left">Party Name</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {parties.map((party) => (
              <>
                <tr
                  key={party.partyId}
                  onClick={() => toggleExpand(party.partyId)}
                  className="cursor-pointer border-b hover:bg-gray-100 transition"
                >
                  <td className="p-4 font-semibold">{party.partyName}</td>
                  <td className="p-4 text-center text-lg flex justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdate(party);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                    >
                      Update
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(party.partyId);
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                {expandedParty === party.partyId && (
                  <tr className="bg-gray-50">
                    <td colSpan="2" className="p-4">
                      <table className="w-full border border-gray-300 rounded-md">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="p-3 text-left">Location Name</th>
                            <th className="p-3 text-left">Location</th>
                          </tr>
                        </thead>
                        <tbody>
                          {party.locations.map((location, index) => (
                            <tr
                              key={index}
                              className="border-b hover:bg-gray-100 transition"
                            >
                              <td className="p-3">{location.locationName}</td>
                              <td className="p-3">{location.location}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Location;
