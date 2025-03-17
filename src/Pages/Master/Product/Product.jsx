import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.min.css";
import config from "../../../config";

registerAllModules();

const Product = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch product data from API

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${config.API_URL}/api/master/getProduct`
      );
      console.log(response.data);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = products.filter((product) =>
      Object.values(product).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // Handle checkbox selection
  const handleCheckboxChange = (rowIndex) => {
    const selected = [...selectedProducts];
    const productId = products[rowIndex]._id;

    if (selected.includes(productId)) {
      setSelectedProducts(selected.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selected, productId]);
    }
  };

  // Custom renderer for the checkbox column
  const checkboxRenderer = (instance, td, row, col, prop, value) => {
    td.innerHTML = ""; // Clear existing content

    // Ensure products[row] exists before accessing _id
    if (!products[row]) {
      td.textContent = "Loading..."; // Show placeholder while data loads
      return;
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    // Check if the product ID exists before setting the checked state
    if (products[row]._id) {
      checkbox.checked = selectedProducts.includes(products[row]._id);
      checkbox.addEventListener("change", () => handleCheckboxChange(row));
    }

    td.appendChild(checkbox);
  };

  // Delete selected products
  const handleDelete = async () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product to delete.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete selected products?"))
      return;

    try {
      await axios.post(`${config.API_URL}/api/master/deleteProduct`, {
        productIds: selectedProducts,
      });

      // Remove deleted products from state
      fetchProducts();

      setSelectedProducts([]); // Clear selection

      alert("Selected products deleted successfully!");
    } catch (error) {
      console.error("Error deleting products:", error);
      alert("Failed to delete products!");
    }
  };

  const handleEdit = (product) => {
    navigate("addProduct", { state: { product } }); // Pass product data to AddProduct
  };

  const editRenderer = (instance, td, row, col, prop, value) => {
    td.innerHTML = "";
    const button = document.createElement("button");
    button.textContent = "Edit";
    button.className =
      "px-3 py-1 m-1 bg-blue-500 text-white rounded hover:bg-blue-600";
    button.onclick = () => handleEdit(products[row]); // Pass product data
    td.appendChild(button);
  };

  const sizeRenderer = (instance, td, row, col, prop, value) => {
    td.innerHTML = ""; // Clear previous content

    if (products[row] && products[row].size) {
      td.textContent = products[row].size.sizeName || "N/A"; // Display only sizeName
    } else {
      td.textContent = "N/A"; // Fallback in case size is missing
    }
  };

  // Define column headers for Handsontable
  const columns = [
    { data: null, renderer: checkboxRenderer, title: "Select", width: 50 },
    { data: "styleName", type: "text", title: "Style Name", width: 150 },
    { data: "reference", type: "text", title: "Reference", width: 150 },
    { data: "season", type: "text", title: "Season", width: 150 },
    { data: "category", type: "text", title: "Category", width: 150 },
    { data: "hsnCode", type: "text", title: "HSN Code", width: 150 },
    { data: "price", type: "numeric", title: "Price", width: 150 },
    { data: null, renderer: sizeRenderer, title: "Size", width: 150 },
    { data: null, renderer: editRenderer, title: "Edit", width: 100 },
  ];

  return (
    <div className=" mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Product List</h2>

      {/* Search Field */}

      {/* Add Product Button */}

      <div className="flex gap-4 ">
        <div>
          <button
            onClick={() => navigate("addProduct")}
            className="mb-4 px-4 py-2 bg-[#310b6b] text-white rounded-lg hover:bg-blue-600"
          >
            Add Product
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
          data={filteredProducts}
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

export default Product;
