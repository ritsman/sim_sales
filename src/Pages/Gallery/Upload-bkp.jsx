"use client";

import { useState } from "react";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.min.css";
import axios from "axios";
import config from "../../config";
import { FaTrash } from "react-icons/fa";

registerAllModules();

const GalleryUpload = () => {
  const [data, setData] = useState([
    {
      image: null,
      styleName: "",
      category: "",
      color: "",
      sizes: [],
      price: "",
    },
  ]);
  const [isSizeDialogOpen, setIsSizeDialogOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [newSize, setNewSize] = useState("");
  const [newQuantity, setNewQuantity] = useState("");

  const columns = [
    { data: "image", renderer: imageRenderer, width: 200 },
    { data: "styleName", type: "text", width: 150 },
    { data: "category", type: "text", width: 150 },
    { data: "color", type: "text", width: 150 },
    { data: "sizes", renderer: sizesRenderer, width: 200 },
    { data: "price", type: "numeric", width: 120 },
  ];

  function imageRenderer(instance, td, row, col, prop, value) {
    const file = value instanceof File ? value : null;
    td.innerHTML = file
      ? `<button class='bg-blue-500 text-white px-2 py-1 rounded'>Change</button> ${file.name}`
      : `<button class='bg-green-500 text-white px-2 py-1 rounded'>Upload</button>`;
    td.querySelector("button").addEventListener("click", () =>
      openFileSelector(row, instance)
    );
    td.style.minHeight = "40px";
    td.style.padding = "5px";
    td.style.display = "flex";
    td.style.alignItems = "center";
    return td;
  }

  function sizesRenderer(instance, td, row) {
    const sizes = data[row]?.sizes || [];

    // Clear previous content
    td.innerHTML = "";

    // Create the Edit Sizes button
    const editButton = document.createElement("button");
    editButton.className = "bg-gray-500 text-white px-3 py-1 rounded mr-2";
    editButton.innerText = "Edit";
    editButton.onclick = () => openSizeDialog(row);

    // Create a scrollable container for sizes
    const sizeContainer = document.createElement("div");
    sizeContainer.style.display = "flex";
    sizeContainer.style.flexWrap = "wrap";
    sizeContainer.style.gap = "8px";
    sizeContainer.style.maxHeight = "40px";
    sizeContainer.style.overflowY = "auto";

    // Add size elements
    sizes.forEach((s, index) => {
      const sizeTag = document.createElement("div");
      sizeTag.className =
        "bg-gray-200 text-black px-2 py-1 rounded flex items-center whitespace-nowrap";
      sizeTag.innerHTML = `${s.size}:${s.quantity} 
        <button class='ml-2 text-red-500 font-bold' data-index="${index}">×</button>`;

      sizeTag.querySelector("button").onclick = (event) => {
        event.stopPropagation();
        removeSize(row, index);
      };

      sizeContainer.appendChild(sizeTag);
    });

    // Append elements to cell
    td.appendChild(editButton);
    td.appendChild(sizeContainer);

    // Apply styles
    td.style.display = "flex";
    td.style.alignItems = "center";
    td.style.gap = "10px";
    td.style.padding = "5px";
    td.style.minHeight = "40px";

    return td;
  }

  const removeSize = (row, index) => {
    setData((prevData) => {
      const newData = [...prevData];
      newData[row].sizes = newData[row].sizes.filter((_, i) => i !== index);
      return newData;
    });
  };

  function openFileSelector(row, instance) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        setData((prevData) => {
          const newData = [...prevData];
          newData[row] = { ...newData[row], image: file };
          return newData;
        });
        instance.render();
      }
    };
    input.click();
  }

  const openSizeDialog = (row) => {
    setCurrentRow(row);
    setIsSizeDialogOpen(true);
  };

  const addSize = () => {
    if (newSize && newQuantity) {
      setData((prevData) => {
        const newData = [...prevData];
        newData[currentRow].sizes = [
          ...newData[currentRow].sizes,
          { size: newSize, quantity: Number.parseInt(newQuantity, 10) },
        ];
        return newData;
      });
      setNewSize("");
      setNewQuantity("");
    }
  };

  const handleSubmit = async () => {
    // Remove empty rows before submission
    const filteredData = data.filter(
      (row) =>
        row.category.trim() !== "" ||
        row.color.trim() !== "" ||
        row.sizes.length > 0 ||
        row.styleName !== "" ||
        row.price !== "" ||
        row.image instanceof File
    );

    // If no valid rows exist, prevent submission
    if (filteredData.length === 0) {
      alert("No valid data to submit!");
      return;
    }

    try {
      const formData = new FormData();
      let hasValidData = false;

      filteredData.forEach((row, index) => {
        if (row.image instanceof File) {
          formData.append(`image_${index}`, row.image);
          hasValidData = true;
        }
        const jsonData = {
          category: row.category,
          styleName: row.styleName,
          color: row.color,
          sizes: row.sizes,
          price: row.price,
        };

        // Ensure that at least one field has a value before appending
        if (
          jsonData.category.trim() !== "" ||
          jsonData.color.trim() !== "" ||
          jsonData.sizes.length > 0 ||
          jsonData.price !== "" ||
          jsonData.styleName !== ""
        ) {
          formData.append(`data_${index}`, JSON.stringify(jsonData));
          hasValidData = true;
        }
      });

      // Final check to ensure FormData has at least one valid entry
      if (!hasValidData) {
        alert("No valid data to submit!");
        return;
      }

      await axios.post(
        `${config.API_URL}/api/gallery/uploadGallery/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Data submitted successfully!");
    } catch (error) {
      console.error("Error submitting data", error);
      alert("Submission failed. Please try again.");
    }
  };

  const handleAddRow = () => {
    setData([
      ...data,
      {
        image: null,
        styleName: "",
        category: "",
        color: "",
        sizes: [],
        price: "",
      },
    ]);
  };

  const deleteRow = (index) => {
    setData((prevData) => prevData.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 bg-gray-100 w-screen min-h-screen">
      <div className="bg-white w-full p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Gallery Upload</h2>
        <div className="flex items-center w-full">
          <div className="w-[80%] ">
            <HotTable
              data={data}
              colHeaders={[
                "Image",
                "Style Name",
                "Category",
                "Color",
                "Sizes",
                "Price",
              ]}
              columns={columns}
              rowHeaders={true}
              width="100%"
              height="auto"
              autoRowSize={true}
              licenseKey="non-commercial-and-evaluation"
              afterChange={(changes, source) => {
                if (source !== "loadData" && changes) {
                  setData((prevData) => {
                    const newData = [...prevData];
                    changes.forEach(([row, prop, , newValue]) => {
                      if (newValue !== null && newValue !== undefined) {
                        newData[row] = { ...newData[row], [prop]: newValue };
                      }
                    });
                    return newData;
                  });
                }
              }}
            />
          </div>
          <div className=" flex flex-col">
            {data.map((_, index) => (
              <button
                key={index}
                onClick={() => deleteRow(index)}
                className="mb-2 mt-4 p-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center"
                aria-label={`Delete row ${index + 1}`}
              >
                <FaTrash size={16} />
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-5 mt-4">
          <button
            onClick={handleAddRow}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Add a row
          </button>
          <button
            onClick={handleSubmit}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Submit
          </button>
        </div>
      </div>

      {isSizeDialogOpen && (
        <div className="fixed inset-0 bg-black z-[999] bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Add Sizes and Quantities</h3>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Size"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                className="border p-2 mr-2"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                className="border p-2"
              />
            </div>
            <div className="flex gap-5 items-center ">
              <button
                onClick={addSize}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 "
              >
                Add Size
              </button>
              <button
                onClick={() => setIsSizeDialogOpen(false)}
                className=" bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryUpload;
