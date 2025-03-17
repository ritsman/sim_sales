import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import config from "../../../config";
import { toast } from "react-toastify";

const statesOfIndia = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const AddParty = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingParty = location.state?.company || null;

  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    bank: "",
    contactPerson: "",
    landline: "",
    account: "",
    ifsc: "",
    role: "Buyer",
    mobile: "",
    address: "",
    city: "",
    openingBalance: "",
    state: "",
    pan: "",
    gst: "",
    pin: "",
  });

  useEffect(() => {
    if (editingParty) {
      const { _id, updatedAt, __v,
createdAt, ...filteredData } = editingParty;
      setFormData(filteredData);
    }
  }, [editingParty]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingParty) {
        await axios.put(
          `${config.API_URL}/api/master/updateParty/${editingParty._id}`,
          formData
        );
        toast.success("Party updated successfully!");
      } else {
        await axios.post(`${config.API_URL}/api/master/createParty`, formData);
        toast.success("New party added successfully!");
      }
      navigate(-1);
    } catch (error) {
      console.error("Error submitting data", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">
        {editingParty ? "Edit Party" : "Add Party"}
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
        {Object.keys(formData).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="font-semibold uppercase text-gray-600">
              {key.replace(/([A-Z])/g, " $1")}
            </label>
            {key === "role" ? (
              <select
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="border px-3 py-2 rounded focus:ring focus:ring-blue-300"
              >
                <option value="Buyer">Buyer</option>
                <option value="Seller">Seller</option>
              </select>
            ) : key === "state" ? (
              <select
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="border px-3 py-2 rounded focus:ring focus:ring-blue-300"
              >
                <option value="">Select State</option>
                {statesOfIndia.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="border px-3 py-2 rounded focus:ring focus:ring-blue-300"
              />
            )}
          </div>
        ))}
        <div className="col-span-full flex justify-end space-x-4">
          <button
            type="submit"
            className="bg-[#310b6b] hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {editingParty ? "Update" : "Submit"}
          </button>
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="bg-[#310b6b] hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddParty;
