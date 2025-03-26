import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HotTable } from "@handsontable/react";
import axios from "axios";
import config from "../../../config";

const DetailedStock = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hotTableRef = useRef(null);
  const { itemId, itemName, itemType, itemColor } = location.state || {};

  const [columnCount, setColumnCount] = useState(0);
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [columnNames, setColumnNames] = useState([]);
  const [editableColumnNames, setEditableColumnNames] = useState([]);

  const handleColumnCountSubmit = () => {
    if (columnCount > 0) {
      const newColumnNames = Array.from({ length: columnCount }, (_, i) => "");
      const fullColumnNames = [...newColumnNames, "Quantity"];
      const initialData = Array.from({ length: 5 }, () =>
        Array(fullColumnNames.length).fill("")
      );

      setColumnNames(fullColumnNames);
      setEditableColumnNames([...newColumnNames, "Quantity"]);
      setTableData(initialData);
      setShowTable(true);
    }
  };

  const handleColumnNameChange = (index, value) => {
    const updatedColumnNames = [...columnNames];
    const updatedEditableNames = [...editableColumnNames];

    if (index < columnNames.length - 1) {
      updatedColumnNames[index] = value;
      updatedEditableNames[index] = value;
    }

    setColumnNames(updatedColumnNames);
    setEditableColumnNames(updatedEditableNames);
  };

  const handleAddNewRow = () => {
    const newRow = Array(columnNames.length).fill("");
    setTableData((prevData) => [...prevData, newRow]);
  };

  const handleAttachStock = async() => {
    const filteredStockDetails = tableData
      .map((row) => {
        const stockEntry = {};
        columnNames.forEach((colName, index) => {
          stockEntry[colName] = row[index];
        });
        return stockEntry;
      })
      .filter((entry) =>
        Object.values(entry).some((value) => value !== "" && value !== null)
      ); // Remove empty rows

    if (filteredStockDetails.length === 0) {
      alert("No valid stock data to attach.");
      return;
    }
   
     let detailedData = {
       Quantity:null,
       itemId,
       stockDetails:filteredStockDetails
     };

          try {
       const response = await axios.post(
         `${config.API_URL}/api/master/addDetailedItemStock`,
         detailedData
       );
    console.log(response)
    alert("Stock Saved successfully!");
  } catch (error) {
    console.error("Error saving stock:", error);
    alert("Failed to Saved stock.");
  }
    navigate(-1); // Redirect back to Items page
  };

  if (!itemId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold text-red-500">
          No item selected. Please go back.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="border-b pb-4 mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Detailed Stock Entry
        </h2>
        <p className="text-gray-500 text-sm">
          Fill in the stock details for the selected item.
        </p>
      </div>

      {/* Item Details */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-gray-700">Item Details</h3>
        <p className="text-gray-600">
          <strong>Name:</strong> {itemName}
        </p>
        <p className="text-gray-600">
          <strong>Type:</strong> {itemType}
        </p>
        <p className="text-gray-600">
          <strong>Color:</strong> {itemColor}
        </p>
      </div>

      {/* Column Input Section */}
      {!showTable && (
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-medium">
            Number of Custom Columns:
          </label>
          <input
            type="number"
            value={columnCount}
            onChange={(e) => setColumnCount(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            min="1"
            max="10"
          />
          <button
            onClick={handleColumnCountSubmit}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Table
          </button>
        </div>
      )}

      {/* Handsontable Section */}
      {showTable && (
        <div>
          {/* Column Name Input Section */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">
              Enter Column Names:
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {editableColumnNames.slice(0, -1).map((colName, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Column ${index + 1} Name`}
                  value={colName}
                  onChange={(e) =>
                    handleColumnNameChange(index, e.target.value)
                  }
                  className="border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              * The last column is fixed as "Quantity".
            </p>
          </div>

          {/* Table Section */}
          <HotTable
            ref={hotTableRef}
            data={tableData}
            colHeaders={columnNames}
            columns={columnNames.map(() => ({ type: "text" }))}
            width="100%"
            height="auto"
            rowHeaders={true}
            manualColumnResize={true}
            afterChange={(changes) => {
              if (changes) {
                const newData = [...tableData];
                changes.forEach(([row, prop, oldVal, newVal]) => {
                  newData[row][prop] = newVal;
                });
                setTableData(newData);
              }
            }}
            licenseKey="non-commercial-and-evaluation"
          />

          {/* Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleAddNewRow}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add New Row
            </button>

            <button
              onClick={handleAttachStock}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>

            <button
              onClick={() => {
                setShowTable(false);
                setColumnCount(0);
                setColumnNames([]);
                setEditableColumnNames([]);
                setTableData([]);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailedStock;
