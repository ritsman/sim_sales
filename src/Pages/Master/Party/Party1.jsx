import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.min.css";
import config from "../../../config";

registerAllModules();

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

const Party = () => {
  const navigate = useNavigate();
  const [parties, setParties] = useState([]);
  const [selectedParties, setSelectedParties] = useState([]);
  const [filteredParties, setFilteredParties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch product data from API

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${config.API_URL}/api/master/getParty`
      );
      console.log(response.data);
      setParties(response.data);
      setFilteredParties(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = parties.filter((party) =>
      Object.values(party).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredParties(filtered);
  }, [searchTerm, parties]);

  // Handle checkbox selection
  const handleCheckboxChange = (rowIndex) => {
    const selected = [...selectedParties];
    const partyId = parties[rowIndex]._id;

    if (selected.includes(partyId)) {
      setSelectedParties(selected.filter((id) => id !== partyId));
    } else {
      setSelectedParties([...selected, partyId]);
    }
  };

  // Custom renderer for the checkbox column
  const checkboxRenderer = (instance, td, row, col, prop, value) => {
    td.innerHTML = ""; // Clear existing content

    // Ensure products[row] exists before accessing _id
    if (!parties[row]) {
      td.textContent = "Loading..."; // Show placeholder while data loads
      return;
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    // Check if the product ID exists before setting the checked state
    if (parties[row]._id) {
      checkbox.checked = selectedParties.includes(parties[row]._id);
      checkbox.addEventListener("change", () => handleCheckboxChange(row));
    }

    td.appendChild(checkbox);
  };

  // Delete selected products
  const handleDelete = async () => {
    if (selectedParties.length === 0) {
      alert("Please select at least one party to delete.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete selected party?"))
      return;

    try {
      await axios.post(`${config.API_URL}/api/master/deleteParty`, {
        partyId: selectedParties,
      });

      // Remove deleted products from state
      fetchProducts();

      setSelectedParties([]); // Clear selection

      alert("Selected parties deleted successfully!");
    } catch (error) {
      console.error("Error deleting parties:", error);
      alert("Failed to delete parties!");
    }
  };

  const handleEdit = (party) => {
    navigate("addParty", { state: { company: party } }); // Pass product data to AddProduct
  };

  const editRenderer = (instance, td, row, col, prop, value) => {
    td.innerHTML = "";
    const button = document.createElement("button");
    button.textContent = "Edit";
    button.className =
      "px-3 py-1 m-1 bg-[#310b6b] text-white rounded hover:bg-blue-600";
    button.onclick = () => handleEdit(parties[row]); // Pass product data
    td.appendChild(button);
  };

  // Define column headers for Handsontable
  const columns = [
    { data: null, renderer: checkboxRenderer, title: "Select", width: 50 },
    { data: "companyName", type: "text", title: "Company Name", width: 150 },
    {
      data: "contactPerson",
      type: "text",
      title: "Contact Person",
      width: 150,
    },
    { data: "address", type: "text", title: "Address", width: 150 },
    { data: "city", type: "text", title: "City", width: 150 },
    { data: "state", type: "text", title: "State", width: 150 },
    { data: "email", type: "numeric", title: "Email", width: 150 },
    { data: "role", type: "numeric", title: "Role", width: 150 },
    { data: "mobile", type: "numeric", title: "Mobile", width: 150 },

    { data: null, renderer: editRenderer, title: "Edit", width: 100 },
  ];

  return (
    <div className=" mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Party List</h2>

      {/* Search Field */}

      {/* Add Product Button */}

      <div className="flex gap-4 ">
        <div>
          <button
            onClick={() => navigate("addParty")}
            className="mb-4 px-4 py-2 bg-[#310b6b] text-white rounded-lg hover:bg-blue-600"
          >
            Add Party
          </button>
        </div>
        {/* Delete Button */}
        <div>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete Selected
          </button>
        </div>
        <div>
          <input
            type="text"
            placeholder="Search..."
            className="mb-4 p-2 border rounded w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Handsontable */}
      <div className="overflow-auto  rounded">
        <HotTable
          data={filteredParties}
          colHeaders={columns.map((col) => col.title)}
          columns={columns}
          rowHeaders={true}
          width="100%"
          height="400"
          licenseKey="non-commercial-and-evaluation"
          autoWrapRow={true}
          autoWrapCol={true}
        />
      </div>
    </div>
  );
};

export default Party;
