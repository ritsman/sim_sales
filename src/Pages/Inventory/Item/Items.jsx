import { useEffect, useState, useRef } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../config";

const ItemsInventory = () => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [hoveredItems, setHoveredItems] = useState(null);
  const popupRef = useRef(null);

  // Fetch product data from API
  const fetchItems = async () => {
    try {
      const response1 = await axios.get(
        `${config.API_URL}/api/master/getItems`
      );
      const response2 = await axios.get(
        `${config.API_URL}/api/master/getItemStock/`
      );

      let mergedItems = response1.data.map((item) => {
        let stock = response2.data.stockData.find(
          (stock) => stock.itemId == item._id
        );
        return {
          ...item,
          availableStock: stock.availableStock,
        };
      });
      console.log(mergedItems);
      setItems(mergedItems);
      setFilteredItems(mergedItems);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

   // Handle search
    useEffect(() => {
      const filtered = items.filter((item) =>
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredItems(filtered);
    }, [searchTerm, items]);

  // Select all products
  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map((item) => item._id));
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
    }, [hoveredItems]);

  return (
    <div className="mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Items List</h2>

      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search..."
            className="p-2 border rounded w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className=" relative">
        {/* Image Popup */}
        {hoveredItems && hoveredItems.image && (
          <div
            ref={popupRef}
            className="absolute z-[1001] bg-white border border-gray-300 rounded shadow-lg p-2"
            style={{
              pointerEvents: "none",
            }}
          >
            <img
              // src={getImageUrl(hoveredProduct.images.image1)}
              src={`${config.API_URL}${hoveredItems.image}`}
              alt={hoveredItems.itemName}
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
                    selectedItems.length === filteredItems.length &&
                    filteredItems.length > 0
                  }
                  onChange={handleSelectAll}
                  className="cursor-pointer"
                />
              </th>
              <th
                className="py-2 px-3 border text-left cursor-pointer hover:bg-gray-200"
                // onClick={() => requestSort("styleName")}
              >
                Item Name{" "}
                {/* {sortConfig.key === "styleName" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")} */}
              </th>
              <th
                className="py-2 px-3 border text-left cursor-pointer hover:bg-gray-200"
                // onClick={() => requestSort("reference")}
              >
                Item type{" "}
                {/* {sortConfig.key === "reference" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")} */}
              </th>
              <th
                className="py-2 px-3 border text-left cursor-pointer hover:bg-gray-200"
                // onClick={() => requestSort("season")}
              >
                Item Color{" "}
                {/* {sortConfig.key === "season" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")} */}
              </th>
              <th
                className="py-2 px-3 border text-left cursor-pointer hover:bg-gray-200"
                // onClick={() => requestSort("category")}
              >
                GST (%){" "}
                {/* {sortConfig.key === "category" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")} */}
              </th>
              <th
                className="py-2 px-3 border text-left cursor-pointer hover:bg-gray-200"
                // onClick={() => requestSort("hsnCode")}
              >
                HSN Code{" "}
                {/* {sortConfig.key === "hsnCode" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")} */}
              </th>
              <th
                className="py-2 px-3 border text-left cursor-pointer hover:bg-gray-200"
                // onClick={() => requestSort("price")}
              >
                Price{" "}
                {/* {sortConfig.key === "price" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")} */}
              </th>
              <th
                className="py-2 px-3 border text-left cursor-pointer hover:bg-gray-200"
                // onClick={() => requestSort("price")}
              >
                Available Stock{" "}
                {/* {sortConfig.key === "price" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")} */}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <React.Fragment key={item._id}>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-3 border">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item._id)}
                      onChange={() => handleCheckboxChange(item._id)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td
                    className="py-2 px-3 border cursor-pointer"
                    onMouseEnter={() => setHoveredItems(item)}
                    onMouseLeave={() => setHoveredItems(null)}
                  >
                    <span className="text-blue-600 ">{item.itemName}</span>{" "}
                  </td>
                  <td className="py-2 px-3 border">{item.itemType}</td>
                  <td className="py-2 px-3 border">{item.itemColor}</td>
                  <td className="py-2 px-3 border">{item.gst}</td>
                  <td className="py-2 px-3 border">{item.hsnCode}</td>
                  <td className="py-2 px-3 border">{item.rate}</td>
                  <td className="py-2 px-3 border">{item.availableStock}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No items found.{" "}
          {searchTerm && "Try adjusting your search criteria."}
        </div>
      )}

      <div className="mt-4 text-gray-600 text-sm">
        Showing {filteredItems.length} of {items.length} Items
        {selectedItems.length > 0 &&
          ` (${selectedItems.length} selected)`}
      </div>
    </div>
  );
};

export default ItemsInventory;
