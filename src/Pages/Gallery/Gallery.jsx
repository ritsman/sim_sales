// import { useState, useEffect,useRef } from "react";
// import axios from "axios";
// import config from "../../config";
// import { FaTrash, FaEdit, FaTimes, FaPlus  } from "react-icons/fa";

// const Gallery = () => {
//  const [products, setProducts] = useState([]);

//  useEffect(() => {
//    fetchProducts();
//  }, []);

//  const fetchProducts = async () => {
//    try {
//      const productResponse = await axios.get(
//        `${config.API_URL}/api/master/getProduct/`
//      );
//      const stockResponse = await axios.get(
//        `${config.API_URL}/api/gallery/getStock/`
//      );

//      const productData = productResponse.data;
//      const stockData = stockResponse.data;

//      // Merge stock data into product details
//      //  const mergedData = productData.map((product) => {
//      //    const stockEntry =
//      //      stockData.find((stock) => stock.productId === product._id) || {};
//      //    return {
//      //      ...product,
//      //      sizes: stockEntry.sizes || {}, // Default to empty object if no stock entry
//      //      image: product.images?.image1 || "https://via.placeholder.com/150", // Use first image from images object
//      //    };
//      //  });

//      // Process stock data: Aggregate IN, OUT, and RESERVED
//    const stockMap = {};

//    stockData.forEach((stock) => {
//      stock.sizes.forEach(({ size, quantity }) => {
//        if (!stockMap[stock.productId]) {
//          stockMap[stock.productId] = {};
//        }

//        if (!stockMap[stock.productId][size]) {
//          stockMap[stock.productId][size] = {
//            totalIn: 0,
//            totalOut: 0,
//            totalReserved: 0,
//            totalUnreserved: 0, // ✅ Added this field
//          };
//        }

//        if (stock.type === "IN") {
//          stockMap[stock.productId][size].totalIn += quantity;
//        } else if (stock.type === "OUT") {
//          stockMap[stock.productId][size].totalOut += quantity;
//        } else if (stock.type === "RESERVED") {
//          stockMap[stock.productId][size].totalReserved += quantity;
//        } else if (stock.type === "UNRESERVED") {
//          stockMap[stock.productId][size].totalUnreserved += quantity; // ✅ Deduct unreserved stock
//        }
//      });
//    });

//    // Merge stock data into product details
//    const mergedData = productData.map((product) => {
//      const sizesData = stockMap[product._id] || {};

//      // Convert to UI-friendly format
//      const sizesObject = Object.keys(sizesData).reduce((acc, size) => {
//        acc[size] = Math.max(
//          sizesData[size].totalIn -
//            sizesData[size].totalOut -
//            (sizesData[size].totalReserved - sizesData[size].totalUnreserved), // ✅ Handle unreserved stock
//          0 // Ensure stock never goes negative
//        );
//        return acc;
//      }, {});

//      return {
//        ...product,
//        sizes: sizesObject, // Now contains correct availableStock for each size
//        image: product.images?.image1 || "https://via.placeholder.com/150",
//      };
//    });

//         console.log(mergedData)
//      setProducts(mergedData);
//    } catch (error) {
//      console.error("Error fetching products and stock data", error);
//    }
//  };

//  return (
//    <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
//      {products.map((product) => (
//        <div
//          key={product._id}
//          className="border rounded-lg p-4 shadow-lg bg-white"
//        >
//          <img
//            src={`${config.API_URL}${product.image}`}
//            alt={product.styleName}
//            className="w-full h-40 object-cover rounded"
//          />
//          <h3 className="text-lg font-bold mt-2">{product.styleName}</h3>
//          <p className="text-sm text-gray-600">Category: {product.category}</p>
//          <p className="text-sm text-gray-600">Price: ₹{product.price}</p>

//          {/* Size & Qty Section */}
//          <div className="border p-3 shadow-sm rounded-md bg-gray-50 mt-2">
//            <h4 className="text-sm font-semibold text-gray-700 mb-2">
//              Size & Qty
//            </h4>
//            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
//              {Object.keys(product.sizes).map((key) => (
//                <div
//                  key={key}
//                  className="flex justify-between px-2 py-1 bg-white rounded-md shadow-sm"
//                >
//                  <span className="font-medium">{key}</span>
//                  <span className="text-blue-600">{product.sizes[key]}</span>
//                </div>
//              ))}
//            </div>
//          </div>

//          <p className="text-sm text-gray-600 font-semibold mt-2">
//            Total Quantity:{" "}
//            <span className="text-blue-600 font-bold">
//              {Object.values(product.sizes).reduce((sum, qty) => sum + qty, 0)}
//            </span>
//          </p>
//        </div>
//      ))}
//    </div>
//  );
// };

// export default Gallery;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import { FaTrash, FaEdit, FaTimes, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

const Gallery = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("all");
  const [showAddToCollectionModal, setShowAddToCollectionModal] =
    useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newCollectionName, setNewCollectionName] = useState("");
   const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

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
        `${config.API_URL}/api/gallery/getProductCollections/`
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
          .map((pc) => pc.collectionId);

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

      setProducts(mergedData);
    } catch (error) {
      console.error("Error fetching products and stock data", error);
    }
  };

  const fetchCollections = async () => {
    try {
      const response = await axios.get(
        `${config.API_URL}/api/gallery/getCollections/`
      );
      setCollections(response.data);
    } catch (error) {
      console.error("Error fetching collections", error);
    }
  };

  const createCollection = async () => {
    if (!newCollectionName.trim()) return;

    try {
      await axios.post(`${config.API_URL}/api/gallery/createCollections/`, {
        name: newCollectionName,
      });
      setNewCollectionName("");
      fetchCollections();
      toast.success("added new collection")
    } catch (error) {
      console.error("Error creating collection", error);
      toast.error("error in adding new collection ")
    }
  };

  const addProductToCollection = async (productId, collectionId) => {
    try {
      await axios.post(
        `${config.API_URL}/api/gallery/addProductToCollection/`,
        {
          productId,
          collectionId,
        }
      );
      fetchProducts(); // Refresh product data to update collections
      setShowAddToCollectionModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error adding product to collection", error);
    }
  };

  const removeProductFromCollection = async (productId, collectionId) => {
    try {
      await axios.post(
        `${config.API_URL}/api/gallery/removeProductFromCollection/`,
        {
          productId,
          collectionId,
        }
      );
      fetchProducts(); // Refresh product data
    } catch (error) {
      console.error("Error removing product from collection", error);
    }
  };

  const openAddToCollectionModal = (product) => {
    setSelectedProduct(product);
    setShowAddToCollectionModal(true);
  };

  // Filter products based on selected collection
  const filteredProducts =
    selectedCollection === "all"
      ? products
      : products.filter(
          (product) =>
            product.collections &&
            product.collections.includes(selectedCollection)
        );

  return (
    <div className="p-6">
      {/* Collection Filter and Add Collection */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Collection
          </label>
          <select
            className="w-full md:w-64 p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
          >
            <option value="all">All Products</option>
            {collections.map((collection) => (
              <option key={collection._id} value={collection._id}>
                {collection.name}
              </option>
            ))}
          </select>
        </div>

        <div className="">
          <button
            className=" mt-4 bg-[#310b6b] text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            onClick={() => navigate("collection")}
          >
            Modify Collection
          </button>
        </div>

        {/* <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Create New Collection
          </label>
          <div className="flex">
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className="rounded-l-md p-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Collection name"
            />
            <button
              onClick={createCollection}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaPlus className="mr-2" /> Add
            </button>
          </div>
        </div> */}
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
              <button
                onClick={() => openAddToCollectionModal(product)}
                className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full shadow hover:bg-indigo-700"
                title="Add to collection"
              >
                <FaPlus size={14} />
              </button>
            </div>

            <h3 className="text-lg font-bold mt-2">{product.styleName}</h3>
            <p className="text-sm text-gray-600">
              Category: {product.category}
            </p>
            <p className="text-sm text-gray-600">Price: ₹{product.price}</p>

            {/* Collection Tags */}
            {product.collections && product.collections.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {product.collections.map((collectionId) => {
                  const collectionObj = collections.find(
                    (c) => c._id === collectionId
                  );
                  return collectionObj ? (
                    <div
                      key={collectionId}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center"
                    >
                      {collectionObj.name}
                      <button
                        onClick={() =>
                          removeProductFromCollection(product._id, collectionId)
                        }
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <FaTimes size={10} />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            )}

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

      {/* Add to Collection Modal */}
      {showAddToCollectionModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Add to Collection</h3>
              <button
                onClick={() => setShowAddToCollectionModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <p className="mb-4">
              Select collections for{" "}
              <strong>{selectedProduct.styleName}</strong>:
            </p>

            <div className="max-h-60 overflow-y-auto">
              {collections.length === 0 ? (
                <p className="text-gray-500">
                  No collections available. Create one first.
                </p>
              ) : (
                collections.map((collection) => {
                  const isInCollection =
                    selectedProduct.collections &&
                    selectedProduct.collections.includes(collection._id);

                  return (
                    <div
                      key={collection._id}
                      className="flex items-center mb-2"
                    >
                      <input
                        type="checkbox"
                        id={`collection-${collection._id}`}
                        checked={isInCollection}
                        onChange={() => {
                          if (isInCollection) {
                            removeProductFromCollection(
                              selectedProduct._id,
                              collection._id
                            );
                          } else {
                            addProductToCollection(
                              selectedProduct._id,
                              collection._id
                            );
                          }
                        }}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`collection-${collection._id}`}
                        className="ml-2 block text-sm text-gray-900"
                      >
                        {collection.name}
                      </label>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowAddToCollectionModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
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

export default Gallery;
