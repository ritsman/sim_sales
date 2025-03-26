import { useEffect, useState } from "react";
import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "../../../config";
import { ChevronDown, ChevronRight } from "lucide-react";

const ViewDetailedStock = () => {
  const { itemId } = useParams();
  const [stockEntries, setStockEntries] = useState([]);
  const [expandedEntries, setExpandedEntries] = useState({});
  const [detailedStocks, setDetailedStocks] = useState({});

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedHours = hours.toString().padStart(2, "0");

    return `${day}/${month}/${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
  };

  useEffect(() => {
    const fetchStockEntries = async () => {
      try {
        const response = await axios.get(
          `${config.API_URL}/api/master/getDetailedItemStock/${itemId}`
        );
        setStockEntries(response.data);
      } catch (error) {
        console.error("Error fetching stock entries:", error);
      }
    };
    if (itemId) {
      fetchStockEntries();
    }
  }, [itemId]);

  // Handle entry click to toggle detailed stock
  const handleEntryClick = async (entryId) => {
    // Toggle the expanded state for this specific entry
    setExpandedEntries((prev) => ({
      ...prev,
      [entryId]: !prev[entryId],
    }));

    // Only fetch detailed stock if it hasn't been fetched before
    if (!detailedStocks[entryId]) {
      try {
        const response = await axios.get(
          `${config.API_URL}/api/master/getDetailedItemStockById/${entryId}`
        );
        setDetailedStocks((prev) => ({
          ...prev,
          [entryId]: response.data.detailedStock,
        }));
      } catch (error) {
        console.error("Error fetching detailed stock:", error);
      }
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Stock Entries</h2>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {stockEntries.map((entry) => (
          <div key={entry._id} className="border-b last:border-b-0">
            {/* Stock Entry Row */}
            <div
              className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleEntryClick(entry._id)}
            >
              <div className="flex items-center space-x-3">
                {/* Arrow Indicator */}
                {expandedEntries[entry._id] ? (
                  <ChevronDown className="text-gray-600" />
                ) : (
                  <ChevronRight className="text-gray-600" />
                )}

                {/* Entry Details */}
                <div>
                  <div className="font-semibold">
                    Total Quantity: {entry.totalQuantity}
                  </div>
                  <div className="text-sm text-gray-500">
                    Date: {formatDateTime(entry.date)}
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Stock Table (Nested and Expandable) */}
            {expandedEntries[entry._id] && detailedStocks[entry._id] && (
              <div className="p-4 bg-gray-50">
                <table className="w-full border border-gray-200 bg-white">
                  <thead>
                    <tr className="bg-gray-100">
                      {/* Dynamically generate table headers */}
                      {Object.keys(detailedStocks[entry._id][0] || {}).map(
                        (key) => (
                          <th
                            key={key}
                            className="py-2 px-3 border text-left capitalize"
                          >
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {detailedStocks[entry._id].length > 0 ? (
                      detailedStocks[entry._id].map((stock, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {/* Dynamically generate table cells */}
                          {Object.entries(stock).map(([key, value], idx) => (
                            <td key={idx} className="py-2 px-3 border">
                              {key === "date"
                                ? new Date(value).toLocaleString()
                                : value}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="100%"
                          className="py-2 px-3 text-center text-gray-500"
                        >
                          No detailed stock available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewDetailedStock;
