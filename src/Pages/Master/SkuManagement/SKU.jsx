import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaTrash,
  FaEdit,
  FaTimes,
  FaPlus,
  FaSearch,
  FaLink,
  FaCheckSquare,
} from "react-icons/fa";
import { toast } from "react-toastify";
import config from "../../../config";

const SKU = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [showCreateCollectionModal, setShowCreateCollectionModal] =
    useState(false);
  const [showProductDetailModal, setShowProductDetailModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCollections();
  }, []);

  const fetchProducts = async () => {
    try {
      const productResponse = await axios.get(
        `${config.API_URL}/api/master/getProduct/`
      );
      const stockResponse = await axios.get(
        `${config.API_URL}/api/gallery/getStock/`
      );
      const productCollectionsResponse = await axios.get(
        `${config.API_URL}/api/master/getSkuProduct/`
      );

      const productData = productResponse.data;
      const stockData = stockResponse.data;
      const productCollectionsData = productCollectionsResponse.data || [];

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

      // Merge stock data and collection data into product details
      const mergedData = productData.map((product) => {
        const sizesData = stockMap[product._id] || {};
        const productCollections = productCollectionsData
          .filter((pc) => pc.productId === product._id)
          .map((pc) => pc.skuId);

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

        return {
          ...product,
          sizes: sizesObject,
          image: product.images?.image1 || "https://via.placeholder.com/150",
          collections: productCollections,
        };
      });
       console.log(mergedData)
      setProducts(mergedData);
    } catch (error) {
      console.error("Error fetching products and stock data", error);
    }
  };

  const fetchCollections = async () => {
    try {
      const response = await axios.get(
        `${config.API_URL}/api/master/getSkuCollections/`
      );
      setCollections(response.data);
    } catch (error) {
      console.error("Error fetching collections", error);
    }
  };

  const createCollection = async () => {
    if (!newCollectionName.trim()) return;

    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product for the collection");
      return;
    }

    try {
      // Create the collection
      const collectionResponse = await axios.post(
        `${config.API_URL}/api/master/createSkuCollections/`,
        {
          name: newCollectionName,
        }
      );

      const collectionId = collectionResponse.data._id;

      // Add selected products to the collection
      for (const productId of selectedProducts) {
        await axios.post(`${config.API_URL}/api/master/addSkuProduct/`, {
          productId,
          skuId:collectionId,
        });
      }

      setNewCollectionName("");
      setSelectedProducts([]);
      setShowCreateCollectionModal(false);
      fetchCollections();
      fetchProducts();
      toast.success("Created new collection and added products");
    } catch (error) {
      console.error("Error creating collection", error);
      toast.error(error.response.data.message);
    }
  };

  const toggleProductSelection = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const viewProductDetails = async (product) => {
    setCurrentProduct(product);

    // Fetch related products (products that are in the same collections)
    try {
      const relatedProductIds = new Set();

      // Get all collections this product belongs to
      if (product.collections && product.collections.length > 0) {
        for (const collectionId of product.collections) {
          // For each collection, find other products in it
          const productsInCollection = products.filter(
            (p) =>
              p._id !== product._id &&
              p.collections &&
              p.collections.includes(collectionId)
          );

          productsInCollection.forEach((p) => relatedProductIds.add(p._id));
        }
      }

      const relatedProductsList = products.filter((p) =>
        relatedProductIds.has(p._id)
      );
      setRelatedProducts(relatedProductsList);
    } catch (error) {
      console.error("Error fetching related products", error);
    }

    setShowProductDetailModal(true);
  };

  // Filter products based on search query and selected collection
  const filteredProducts = products.filter(
    (product) =>
      (selectedCollection === "all" ||
        (product.collections &&
          product.collections.includes(selectedCollection))) &&
      (searchQuery === "" ||
        product.styleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">SKU Management</h1>

      {/* Search and Filter Bar */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Box */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Collection Filter */}
        <div>
          <select
            className="w-full p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
          >
            <option value="all">All Collections</option>
            {collections.map((collection) => (
              <option key={collection._id} value={collection._id}>
                {collection.name}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            className="flex-1 bg-[#310b6b] text-white px-4 py-2 rounded-lg hover:bg-[#4a1d8a] transition-colors font-semibold flex items-center justify-center"
            onClick={() => setShowCreateCollectionModal(true)}
            disabled={selectedProducts.length === 0}
          >
            <FaPlus className="mr-2" /> Create SKU 
          </button>
          <button
            className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-semibold flex items-center justify-center"
            onClick={() => navigate("editSku")}
          >
            <FaEdit className="mr-2" /> Manage SKU 
          </button>
        </div>
      </div>

      {/* Selection Info */}
      {selectedProducts.length > 0 && (
        <div className="mb-4 bg-blue-50 p-3 rounded-lg flex justify-between items-center border border-blue-200">
          <div>
            <span className="font-semibold">
              {selectedProducts.length} products selected
            </span>
          </div>
          <button
            onClick={() => setSelectedProducts([])}
            className="text-blue-600 hover:text-blue-800"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className={`border rounded-lg p-4 shadow-lg bg-white relative transition-all ${
              selectedProducts.includes(product._id)
                ? "ring-2 ring-indigo-500 transform scale-[1.02]"
                : ""
            }`}
          >
            {/* Selection Checkbox */}
            <div className="absolute top-2 right-2 z-10">
              <button
                onClick={() => toggleProductSelection(product._id)}
                className={`p-2 rounded-full ${
                  selectedProducts.includes(product._id)
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <FaCheckSquare size={16} />
              </button>
            </div>

            <div
              className="relative"
              onClick={() => viewProductDetails(product)}
            >
              <img
                src={`${config.API_URL}${product.image}`}
                alt={product.styleName}
                className="w-full h-48 object-cover rounded cursor-pointer"
              />
              {product.collections && product.collections.length > 0 && (
                <div className="absolute bottom-2 left-2 bg-indigo-600 text-white px-2 py-1 rounded-full text-xs flex items-center">
                  <FaLink size={10} className="mr-1" />
                  {/* {product.collections.length} */}
                </div>
              )}
            </div>

            <h3
              className="text-lg font-bold mt-3 cursor-pointer"
              onClick={() => viewProductDetails(product)}
            >
              {product.styleName}
            </h3>
            <p className="text-sm text-gray-600">
              Category: {product.category}
            </p>
            <p className="text-sm text-gray-600">Price: ₹{product.price}</p>

            {/* Collection Tags - limited to 2 with count indicator */}
            {product.collections && product.collections.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {product.collections.slice(0, 2).map((collectionId) => {
                  const collectionObj = collections.find(
                    (c) => c._id === collectionId
                  );
                  return collectionObj ? (
                    <div
                      key={collectionId}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {collectionObj.name}
                    </div>
                  ) : null;
                })}
                {product.collections.length > 2 && (
                  <div className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                    +{product.collections.length - 2} more
                  </div>
                )}
              </div>
            )}

            {/* Total Quantity */}
            <p className="text-sm text-gray-600 font-semibold mt-2">
              Qty:{" "}
              <span className="text-blue-600 font-bold">
                {Object.values(product.sizes || {}).reduce(
                  (sum, qty) => sum + qty,
                  0
                )}
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* Create Collection Modal */}
      {showCreateCollectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Create New Collection</h3>
              <button
                onClick={() => setShowCreateCollectionModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Collection Name
              </label>
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="w-full p-2 border rounded-md mb-4 focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter collection name"
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selected Products ({selectedProducts.length})
                </label>
                <div className="max-h-40 overflow-y-auto p-2 border rounded-md bg-gray-50">
                  {selectedProducts.map((productId) => {
                    const product = products.find((p) => p._id === productId);
                    return product ? (
                      <div
                        key={productId}
                        className="flex items-center justify-between py-1 border-b last:border-0"
                      >
                        <span>{product.styleName}</span>
                        <button
                          onClick={() => toggleProductSelection(productId)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTimes size={14} />
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowCreateCollectionModal(false)}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={createCollection}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  disabled={
                    !newCollectionName.trim() || selectedProducts.length === 0
                  }
                >
                  Create Collection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {showProductDetailModal && currentProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{currentProduct.styleName}</h3>
              <button
                onClick={() => setShowProductDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Image and Details */}
              <div>
                <img
                  src={`${config.API_URL}${currentProduct.image}`}
                  alt={currentProduct.styleName}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-sm">
                    <p className="font-semibold">Category</p>
                    <p>{currentProduct.category}</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold">Price</p>
                    <p>₹{currentProduct.price}</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold">SKU</p>
                    <p>{currentProduct.sku || "N/A"}</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold">Total Quantity</p>
                    <p>
                      {Object.values(currentProduct.sizes || {}).reduce(
                        (sum, qty) => sum + qty,
                        0
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Collections and Sizes */}
              <div>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Collections</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentProduct.collections &&
                    currentProduct.collections.length > 0 ? (
                      currentProduct.collections.map((collectionId) => {
                        const collectionObj = collections.find(
                          (c) => c._id === collectionId
                        );
                        return collectionObj ? (
                          <div
                            key={collectionId}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                          >
                            {collectionObj.name}
                          </div>
                        ) : null;
                      })
                    ) : (
                      <p className="text-gray-500">Not in any collection</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Size & Quantity</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(currentProduct.sizes || {}).map(
                      ([size, qty]) => (
                        <div
                          key={size}
                          className="bg-gray-100 p-3 rounded-lg text-center"
                        >
                          <p className="font-bold">{size}</p>
                          <p className="text-blue-600">{qty}</p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Related Products */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-4">Related Products</h4>
              {relatedProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {relatedProducts.map((product) => (
                    <div
                      key={product._id}
                      className="border rounded-lg p-3 cursor-pointer hover:shadow-md"
                      onClick={() => {
                        setCurrentProduct(product);
                        viewProductDetails(product);
                      }}
                    >
                      <img
                        src={`${config.API_URL}${product.image}`}
                        alt={product.styleName}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <h5 className="mt-2 font-medium text-sm truncate">
                        {product.styleName}
                      </h5>
                      <p className="text-xs text-gray-600">₹{product.price}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No related products found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SKU;
