import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import { FaTrash, FaEdit, FaTimes, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

const ItemGallery = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("all");

  useEffect(() => {
    fetchProducts();
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get(
        `${config.API_URL}/api/master/getGroup/`
      );
       let a = response.data.filter(item=>item.type == "item");
      setGroups(a);
    } catch (error) {
      console.error("Error fetching groups", error);
      toast.error("Failed to fetch groups");
    }
  };

  const fetchProducts = async () => {
    try {
      const productResponse = await axios.get(
        `${config.API_URL}/api/master/getItems/`
      );
      const stockResponse = await axios.get(
        `${config.API_URL}/api/master/getTotalItemStockForAll`
      );

      const productData = productResponse.data;

      // Merge stock data into product details
      const mergedData = productData.map((product) => {
        let itemStock = stockResponse.data.find(
          (stock) => stock.itemId == product._id
        );

        return {
          ...product,
          availableStock: itemStock?.totalQuantity ?? 0,
          image:
            product.image ||
            "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg",
        };
      });

      setProducts(mergedData);
    } catch (error) {
      console.error("Error fetching products and stock data", error);
      toast.error("Failed to fetch products");
    }
  };

  // Filter products based on selected group
  const filteredProducts =
    selectedGroup === "all"
      ? products
      : products.filter((product) => product.group === selectedGroup);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Item Gallery</h1>

      {/* Group Filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Group
          </label>
          <select
            className="w-full md:w-64 p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="all">All Items</option>
            {groups.map((group) => (
              <option key={group._id} value={group.name}>
                {group.name}
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

            <h3 className="text-lg font-bold mt-2">{product.itemName}</h3>
            {product.groupId && (
              <p className="text-sm text-gray-600">
                Group:{" "}
                {groups.find((g) => g._id === product.groupId)?.groupName ||
                  "Unknown"}
              </p>
            )}
            <p className="text-sm text-gray-600">Price: ₹{product.rate}</p>

            <p className="text-sm text-gray-600 font-semibold mt-2">
              Total Quantity:{" "}
              <span className="text-blue-600 mr-2 font-bold">
                {product.availableStock}
              </span>
              {product.issueUnit}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemGallery;
