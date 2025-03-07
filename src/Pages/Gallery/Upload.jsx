import { useEffect, useState } from "react";
import axios from "axios";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.min.css";
import config from "../../config";

registerAllModules();

const GalleryUpload = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch product & stock data
  const fetchProducts = async () => {
    try {
      const [productRes, stockRes] = await Promise.all([
        axios.get(`${config.API_URL}/api/master/getProduct/`),
        axios.get(`${config.API_URL}/api/gallery/getStock/`),
      ]);

      const productData = productRes.data;
      const stockData = stockRes.data;

      // Merge stock data into products
      const mergedData = productData.map((product) => {
        const stockEntry = stockData.find(
          (stock) => stock.productId === product._id
        ) || {
          sizes: {},
        };

        return {
          ...product,
          sizes: product.size?.sizes.reduce((acc, size) => {
            acc[size] =
              stockEntry.sizes && stockEntry.sizes[size]
                ? stockEntry.sizes[size].availableStock
                : 0;
            return acc;
          }, {}),
        };
      });

      setProducts(mergedData);
      setCategories([...new Set(mergedData.map((p) => p.category))]);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  // Handle category filter
  const handleView = () => {
    if (!selectedCategory) return;
    setFilteredProducts(
      products.filter((p) => p.category === selectedCategory)
    );
  };

  // Save updated stock data
  const handleSave = async (updatedData) => {
    try {
      const stockUpdates = updatedData.map((product) => ({
        productId: product._id,
        sizes: product.sizes, // Only update sizes (stock)
      }));
       console.log(stockUpdates)
      await axios.put(`${config.API_URL}/api/gallery/createStock/`, {
        stocks: stockUpdates,
      });

      alert("Stock updated successfully!");
      fetchProducts(); // Refresh data after saving
    } catch (error) {
      console.error("Error updating stock", error);
    }
  };

  // Generate columns dynamically
  const columns = [
    { data: "styleName", type: "text", title: "Style Name", readOnly: true },
    { data: "reference", type: "text", title: "Reference", readOnly: true },
    { data: "season", type: "text", title: "Season", readOnly: true },
    { data: "category", type: "text", title: "Category", readOnly: true },
    { data: "hsnCode", type: "text", title: "HSN Code", readOnly: true },
    { data: "price", type: "numeric", title: "Price", readOnly: true },
  ];

  if (filteredProducts.length > 0) {
    const sizeColumns = Object.keys(filteredProducts[0].sizes).map((size) => ({
      data: `sizes.${size}`,
      type: "numeric",
      title: size,
    }));
    columns.push(...sizeColumns);

    // Add total quantity column
    columns.push({
      data: "totalQuantity",
      type: "numeric",
      title: "Total Quantity",
      readOnly: true,
    });
  }

  return (
    <div className="p-6">
      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <label className="text-gray-700 font-semibold text-lg">Category:</label>
        <select
          className="border px-4 py-2 rounded-lg bg-white shadow-sm focus:ring focus:ring-blue-300"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button
          className="px-5 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-all"
          onClick={handleView}
        >
          View
        </button>
      </div>

      {/* Table View */}
      {filteredProducts.length > 0 && (
        <HotTable
          data={filteredProducts.map((product) => ({
            ...product,
            totalQuantity: Object.values(product.sizes).reduce(
              (sum, qty) => sum + qty,
              0
            ),
          }))}
          colHeaders={columns.map((col) => col.title)}
          columns={columns}
          rowHeaders={true}
          width="100%"
          height="auto"
          stretchH="all"
          licenseKey="non-commercial-and-evaluation"
          afterChange={(changes, source) => {
            if (source === "edit") {
              const updatedData = [...filteredProducts];
              changes.forEach(([row, prop, , newVal]) => {
                updatedData[row][prop] = newVal;
                updatedData[row].totalQuantity = Object.values(
                  updatedData[row].sizes
                ).reduce((sum, qty) => sum + qty, 0);
              });
              setFilteredProducts(updatedData);
            }
          }}
        />
      )}

      {/* Save Button */}
      {filteredProducts.length > 0 && (
        <button
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
          onClick={() => handleSave(filteredProducts)}
        >
          Save
        </button>
      )}
    </div>
  );
};

export default GalleryUpload;
