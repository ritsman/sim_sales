import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";

const ProductGallery = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [subgroups, setSubgroups] = useState([]);
  const [selectedSubgroup, setSelectedSubgroup] = useState("all");

  useEffect(() => {
    fetchProducts();
    fetchSubgroups();
  }, []);

  const fetchProducts = async () => {
    try {
      const productResponse = await axios.get(
        `${config.API_URL}/api/master/getProduct/`
      );
      const stockResponse = await axios.get(
        `${config.API_URL}/api/gallery/getStock/`
      );

      const productData = productResponse.data;
      const stockData = stockResponse.data;

      // Process stock data: Aggregate IN, OUT, and RESERVED
      const stockMap = {};

      stockData.forEach((stock) => {
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
      const mergedData = productData.map((product) => {
        console.log(product, "product");
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
        let obj = {};
        if (Object.keys(sizesObject).length === 0) {
          product.size.sizes.map((item) => {
            obj[item] = 0;
            console.log(item);
          });
        }
        return {
          ...product,
          sizes: Object.keys(sizesObject).length === 0 ? obj : sizesObject,
          image: product.images?.image1 || "https://via.placeholder.com/150",
        };
      });

      setProducts(mergedData);
    } catch (error) {
      console.error("Error fetching products and stock data", error);
    }
  };

  const fetchSubgroups = async () => {
    try {
      const response = await axios.get(
        `${config.API_URL}/api/master/getGroup/`
      );
      // Filter subgroups to only include those with type 'product'
      const productSubgroups = response.data.filter(
        (subgroup) => subgroup.type === "product"
      );
      setSubgroups(productSubgroups);
    } catch (error) {
      console.error("Error fetching subgroups", error);
    }
  };

  // Filter products based on selected subgroup
  const filteredProducts =
    selectedSubgroup === "all"
      ? products
      : products.filter((product) => product.category == selectedSubgroup);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Product Gallery</h1>

      {/* Subgroup Filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by group
          </label>
          <select
            className="w-full md:w-64 p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={selectedSubgroup}
            onChange={(e) => setSelectedSubgroup(e.target.value)}
          >
            <option value="all">All Products</option>
            {subgroups.map((subgroup) => (
              <option key={subgroup._id} value={subgroup.name}>
                {subgroup.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="border rounded-lg p-4 shadow-lg bg-white"
          >
            <div className="relative">
              <img
                src={`${config.API_URL}${product.image}`}
                alt={product.styleName}
                className="w-full h-40 object-cover rounded"
              />
            </div>

            <h3 className="text-lg font-bold mt-2">{product.styleName}</h3>
            <p className="text-sm text-gray-600">
              Category: {product.category}
            </p>
            <p className="text-sm text-gray-600">Price: ₹{product.price}</p>

            {/* Size & Qty Section */}
            <div className="border p-3 shadow-sm rounded-md bg-gray-50 mt-2">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Size & Qty
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                {Object.keys(product.sizes).map((key) => (
                  <div
                    key={key}
                    className="flex justify-between px-2 py-1 bg-white rounded-md shadow-sm"
                  >
                    <span className="font-medium">{key}</span>
                    <span className="text-blue-600">{product.sizes[key]}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-sm text-gray-600 font-semibold mt-2">
              Total Quantity:{" "}
              <span className="text-blue-600 font-bold">
                {Object.values(product.sizes).reduce(
                  (sum, qty) => sum + qty,
                  0
                )}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
