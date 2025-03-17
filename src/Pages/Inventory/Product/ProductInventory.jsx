import { useEffect, useState,useRef } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../config";

const ProductInventory = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const popupRef = useRef(null);

  // Fetch product data from API
  const fetchProducts = async () => {
    try {
      const response1 = await axios.get(
        `${config.API_URL}/api/master/getProduct`
      );
      const response2 = await axios.get(
        `${config.API_URL}/api/gallery/getStock/`
      );

      const stockMap = {};

      response2.data.forEach((stock) => {
        stock.sizes.forEach(({ size, quantity }) => {
          if (!stockMap[stock.productId]) {
            stockMap[stock.productId] = {};
          }

          if (!stockMap[stock.productId][size]) {
            stockMap[stock.productId][size] = {
              totalIn: 0,
              totalOut: 0,
              totalReserved: 0,
              totalUnreserved: 0,
            };
          }

          if (stock.type === "IN") {
            stockMap[stock.productId][size].totalIn += quantity;
          } else if (stock.type === "OUT") {
            stockMap[stock.productId][size].totalOut += quantity;
          } else if (stock.type === "RESERVED") {
            stockMap[stock.productId][size].totalReserved += quantity;
          } else if (stock.type === "UNRESERVED") {
            stockMap[stock.productId][size].totalUnreserved += quantity;
          }
        });
      });

      // Merge stock data into product details
      const mergedData = response1.data.map((product) => {
        const sizesData = stockMap[product._id] || {};

        // Convert to UI-friendly format
        const sizesObject = Object.keys(sizesData).reduce((acc, size) => {
          acc[size] = Math.max(
            sizesData[size].totalIn -
              sizesData[size].totalOut -
              (sizesData[size].totalReserved - sizesData[size].totalUnreserved),
            0 // Ensure stock never goes negative
          );
          return acc;
        }, {});

        const sizesArray = Object.entries(sizesObject).map(
          ([type, quantity]) => ({
            type,
            quantity,
          })
        );

        const sizesObject2 = product.size.sizes.reduce((acc, size) => {
          acc[size] = 0;
          return acc;
        }, {});

        const sizesArray2 = Object.entries(sizesObject2).map(
          ([type, quantity]) => ({
            type,
            quantity,
          })
        );

          const totalQuantity = sizesArray.reduce(
            (sum, size) => sum + size.quantity,
            0
          );

        return {
          ...product,
          sizes: sizesArray.length > 0 ? sizesArray : sizesArray2,
          totalQuantity,
        };
      });

      setProducts(mergedData);
      setFilteredProducts(mergedData);
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
  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Toggle row expansion
  const toggleRowExpansion = (productId) => {
    setExpandedRows((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
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

  // Handle sorting
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting to filtered products
  const sortedProducts = React.useMemo(() => {
    let sortableProducts = [...filteredProducts];
    if (sortConfig.key) {
      sortableProducts.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableProducts;
  }, [filteredProducts, sortConfig]);

  // Select all products
  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((product) => product._id));
    }
  };

  // Handle position of the image popup
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (popupRef.current) {
        // Position popup near cursor but not directly under it
        const offset = -300;
        const offset2 = 100;
        popupRef.current.style.left = `${e.pageX + offset2}px`;
        popupRef.current.style.top = `${e.pageY + offset}px`;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [hoveredProduct]);

  return (
    <div className="mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Product List</h2>

      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search..."
            className="p-2 border rounded w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={selectedProducts.length === 0}
          >
            Delete Selected
          </button> */}
        </div>

        {/* <button
          onClick={() => navigate("addProduct")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Product
        </button> */}
      </div>

      <div className=" relative">
        {/* Image Popup */}
        {hoveredProduct &&
          hoveredProduct.images &&
          hoveredProduct.images.image1 && (
            <div
              ref={popupRef}
              className="absolute z-[1001] bg-white border border-gray-300 rounded shadow-lg p-2"
              style={{
                pointerEvents: "none",
              }}
            >
              <img
                // src={getImageUrl(hoveredProduct.images.image1)}
                src={`${config.API_URL}${hoveredProduct.images.image1}`}
                alt={hoveredProduct.styleName}
                // className="max-w-xs max-h-48 object-contain"
                className="w-32 h-32 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder-image.png"; // Fallback image
                }}
              />
            </div>
          )}
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-3 border">
                <input
                  type="checkbox"
                  checked={
                    selectedProducts.length === filteredProducts.length &&
                    filteredProducts.length > 0
                  }
                  onChange={handleSelectAll}
                  className="cursor-pointer"
                />
              </th>
              <th
                className="py-2 px-3 border text-left cursor-pointer hover:bg-gray-200"
                onClick={() => requestSort("styleName")}
              >
                Style Name{" "}
                {sortConfig.key === "styleName" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </th>
              <th
                className="py-2 px-3 border text-left cursor-pointer hover:bg-gray-200"
                onClick={() => requestSort("reference")}
              >
                Reference{" "}
                {sortConfig.key === "reference" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </th>
              <th
                className="py-2 px-3 border text-left cursor-pointer hover:bg-gray-200"
                onClick={() => requestSort("season")}
              >
                Season{" "}
                {sortConfig.key === "season" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </th>
              <th
                className="py-2 px-3 border text-left cursor-pointer hover:bg-gray-200"
                onClick={() => requestSort("category")}
              >
                Category{" "}
                {sortConfig.key === "category" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </th>
              <th
                className="py-2 px-3 border text-left cursor-pointer hover:bg-gray-200"
                onClick={() => requestSort("hsnCode")}
              >
                HSN Code{" "}
                {sortConfig.key === "hsnCode" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </th>
              <th
                className="py-2 px-3 border text-left cursor-pointer hover:bg-gray-200"
                onClick={() => requestSort("price")}
              >
                Price{" "}
                {sortConfig.key === "price" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </th>
              <th className="py-2 px-3 border text-left">Sizes</th>
              <th className="py-2 px-3 border">Total Quantity</th>
              {/* <th className="py-2 px-3 border text-left">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product) => (
              <React.Fragment key={product._id}>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-3 border">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product._id)}
                      onChange={() => handleCheckboxChange(product._id)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td
                    className="py-2 px-3 border cursor-pointer"
                    onMouseEnter={() => setHoveredProduct(product)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    <span className="text-blue-600 ">{product.styleName}</span>{" "}
                  </td>
                  <td className="py-2 px-3 border">{product.reference}</td>
                  <td className="py-2 px-3 border">{product.season}</td>
                  <td className="py-2 px-3 border">{product.category}</td>
                  <td className="py-2 px-3 border">{product.hsnCode}</td>
                  <td className="py-2 px-3 border">{product.price}</td>
                  <td className="py-2 px-3 border">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => toggleRowExpansion(product._id)}
                    >
                      <span className="mr-2 text-blue-500">
                        {expandedRows.includes(product._id) ? "▼" : "►"}
                      </span>
                      <span>
                        {product.sizes.length > 0
                          ? `${product.sizes.length} size${
                              product.sizes.length !== 1 ? "s" : ""
                            } available`
                          : "No sizes available"}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-3 border">{product.totalQuantity}</td>
                  {/* <td className="py-2 px-3 border">
                    <button
                      onClick={() => handleEdit(product)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                  </td> */}
                </tr>
                {expandedRows.includes(product._id) &&
                  product.sizes.length > 0 && (
                    <tr>
                      <td colSpan="9" className="py-0 px-0 border">
                        <div className="p-3 bg-gray-50">
                          <table className="w-1/3 ml-12 text-sm border">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="px-3 py-2 text-left font-medium border">
                                  Size
                                </th>
                                <th className="px-3 py-2 text-left font-medium border">
                                  Quantity
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {product.sizes.map((size, index) => (
                                <tr key={index}>
                                  <td className="px-3 py-2 border">
                                    {size.type || "Unknown"}
                                  </td>
                                  <td className="px-3 py-2 border">
                                    {size.quantity || 0}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No products found.{" "}
          {searchTerm && "Try adjusting your search criteria."}
        </div>
      )}

      <div className="mt-4 text-gray-600 text-sm">
        Showing {filteredProducts.length} of {products.length} products
        {selectedProducts.length > 0 &&
          ` (${selectedProducts.length} selected)`}
      </div>
    </div>
  );
};

export default ProductInventory;
