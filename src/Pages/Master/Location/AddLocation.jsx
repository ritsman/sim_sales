import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import config from "../../../config";
import Select from "react-select"
const AddLocation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingParty = location.state || null;

  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState(
    editingParty
      ? {
          value: {
            partyId: editingParty.partyId,
            partyName: editingParty.partyName,
          },
          label: editingParty.partyName,
        }
      : null
  );
  const [locations, setLocations] = useState(
    editingParty ? editingParty.locations : [{ locationName: "", location: "" }]
  );

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const response = await axios.get(
          `${config.API_URL}/api/master/getParty`
        );
        const partyOptions = response.data.map((party) => ({
          value: { partyId: party._id, partyName: party.companyName },
          label: party.companyName,
        }));
        setParties(partyOptions);
      } catch (error) {
        console.error("Error fetching parties:", error);
      }
    };
    fetchParties();
  }, []);

  const handleAddLocationField = () => {
    setLocations([...locations, { locationName: "", location: "" }]);
  };

  const handleRemoveLocationField = (index) => {
    if (locations.length === 1) {
      alert("At least one location is required.");
      return;
    }
    setLocations(locations.filter((_, i) => i !== index));
  };

  const handleLocationChange = (index, field, value) => {
    const updatedLocations = [...locations];
    updatedLocations[index][field] = value;
    setLocations(updatedLocations);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !selectedParty ||
      locations.some((loc) => !loc.locationName.trim() || !loc.location.trim())
    ) {
      alert("Please fill all fields");
      return;
    }

    const requestData = {
      party: selectedParty.value,
      locations,
    };

    try {
      if (editingParty) {
        await axios.put(
          `${config.API_URL}/api/master/updateLocation/${editingParty.partyId}`,
          requestData
        );
        alert("Location updated successfully");
      } else {
        await axios.post(
          `${config.API_URL}/api/master/createLocation`,
          requestData
        );
        alert("Location added successfully");
      }
      navigate(-1);
    } catch (error) {
        alert("error in saving data");

      console.error("Error submitting location:", error);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">
        {editingParty ? "Update" : "Add"} Location
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium">Select Party</label>
          <Select
            options={parties}
            value={selectedParty}
            onChange={setSelectedParty}
            placeholder="Search and select a party"
            isDisabled={!!editingParty} // Disable if updating
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Locations</label>
          {locations.map((loc, index) => (
            <div key={index} className="mb-2 border p-2 rounded flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  className="w-full p-2 border rounded mb-1"
                  value={loc.locationName}
                  onChange={(e) =>
                    handleLocationChange(index, "locationName", e.target.value)
                  }
                  placeholder="Enter location name"
                />
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={loc.location}
                  onChange={(e) =>
                    handleLocationChange(index, "location", e.target.value)
                  }
                  placeholder="Enter location details"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveLocationField(index)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddLocationField}
            className="mt-2 bg-green-500 text-white py-1 px-3 rounded"
          >
            + Add Location
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          {editingParty ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddLocation;
