import { useEffect, useState } from "react";
import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "../../../config";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";

// Helper function to format date to dd/mm/yyyy HH:MM:SS AM/PM
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

const StockLedgerView = () => {
  const { itemId } = useParams();
  const [stockEntries, setStockEntries] = useState([]);
  const [runningBalance, setRunningBalance] = useState(0);
  const [expandedEntries, setExpandedEntries] = useState({});
  const [detailedStocks, setDetailedStocks] = useState({});
  const [itemName,setItemName] = useState("");

    const fetchStockEntries = async () => {
      try {
        const response = await axios.get(
          `${config.API_URL}/api/master/getDetailedItemStock/${itemId}`
        );

        // Sort entries by date
        const sortedEntries = response.data.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        // Calculate running balance
        let balance = 0;
        const entriesWithBalance = sortedEntries.map((entry) => {
          if (entry.type === "IN") {
            balance += entry.totalQuantity;
          } else if (entry.type === "OUT") {
            balance -= entry.totalQuantity;
          }
          return {
            ...entry,
            runningBalance: balance,
          };
        });

        setStockEntries(entriesWithBalance);
        setRunningBalance(balance);
      } catch (error) {
        console.error("Error fetching stock entries:", error);
      }
    };

  useEffect(() => {
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

    const handleDelete = async (entryId) => {
      try {
        // Confirm deletion
        const confirmDelete = window.confirm(
          "Are you sure you want to delete this stock entry?"
        );

        if (confirmDelete) {
          // Replace with your actual delete API endpoint
          await axios.delete(
            `${config.API_URL}/api/master/deleteDetailedItemStockById/${entryId}`
          );

          // // Remove the entry from the local state
          // setStockEntries((prev) =>
          //   prev.filter((entry) => entry._id !== entryId)
          // );

          // // Remove from detailed stocks and expanded entries
          // setDetailedStocks((prev) => {
          //   const updated = { ...prev };
          //   delete updated[entryId];
          //   return updated;
          // });
          // setExpandedEntries((prev) => {
          //   const updated = { ...prev };
          //   delete updated[entryId];
          //   return updated;
          // });
          fetchStockEntries();

        }
      } catch (error) {
        console.error("Error deleting stock entry:", error);
        alert("Failed to delete the stock entry. Please try again.");
      }
    };

  useEffect(() => {
    const fetchItem = async () => {
      try {
        let res = await axios.get(
          `${config.API_URL}/api/master/getItems/${itemId}`
        );

        console.log(res.data);
        setItemName(res.data.itemName);
      } catch (error) {
        console.log(error)
      }
    };
    fetchItem();
  }, [itemId]);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between ">
        <p className="text-2xl font-bold mb-4">Stock Ledger</p>
        <p className="text-2xl font-bold mb-4">
          <span className="mr-2 text-xl font-bold text-gray-500">
            Item Name :
          </span>
          {itemName}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-300">
              <th className="p-3 text-left w-[5%]">
                {/* Placeholder for expand/collapse icon */}
              </th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-right">IN</th>
              <th className="p-3 text-right">OUT</th>
              <th className="p-3 text-right">Running Stock</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stockEntries.map((entry) => (
              <React.Fragment key={entry._id}>
                <tr
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleEntryClick(entry._id)}
                >
                  <td className="p-3">
                    {expandedEntries[entry._id] ? (
                      <ChevronDown className="text-gray-600" />
                    ) : (
                      <ChevronRight className="text-gray-600" />
                    )}
                  </td>
                  <td className="p-3">{formatDateTime(entry.date)}</td>
                  <td className="p-3 text-right text-green-800">
                    {entry.type === "IN" ? entry.totalQuantity : "-"}
                  </td>
                  <td className="p-3 text-right text-red-800">
                    {entry.type === "OUT" ? entry.totalQuantity : "-"}
                  </td>
                  <td className="p-3 text-right font-bold">
                    {entry.runningBalance}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDelete(entry._id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
                {/* Detailed Stock Table (Nested and Expandable) */}
                {expandedEntries[entry._id] && detailedStocks[entry._id] && (
                  <tr>
                    <td colSpan="5" className="p-4 bg-gray-50">
                      <table className="w-full border border-gray-200 bg-white">
                        <thead>
                          <tr className="bg-gray-100">
                            {/* Dynamically generate table headers */}
                            {Object.keys(
                              detailedStocks[entry._id][0] || {}
                            ).map((key) => (
                              <th
                                key={key}
                                className="py-2 px-3 border text-left capitalize"
                              >
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {detailedStocks[entry._id].length > 0 ? (
                            detailedStocks[entry._id].map((stock, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                {/* Dynamically generate table cells */}
                                {Object.entries(stock).map(
                                  ([key, value], idx) => (
                                    <td key={idx} className="py-2 px-3 border">
                                      {key === "date"
                                        ? formatDateTime(value)
                                        : value}
                                    </td>
                                  )
                                )}
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
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Final Balance Summary */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg flex justify-between items-center">
        <span className="font-semibold text-lg">Final Stock Quantity:</span>
        <span className="font-bold text-xl">{runningBalance}</span>
      </div>
    </div>
  );
};

export default StockLedgerView;
