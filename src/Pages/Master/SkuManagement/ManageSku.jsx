import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaTrash,
  FaEdit,
  FaTimes,
  FaChevronLeft,
  FaPlus,
  FaEye,
  FaSave,
  FaSearch,
} from "react-icons/fa";
import { toast } from "react-toastify";
import config from "../../../config";

const ManageSku = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingCollection, setEditingCollection] = useState(null);
  const [collectionName, setCollectionName] = useState("");
  const [collectionProducts, setCollectionProducts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentCollection, setCurrentCollection] = useState(null);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    fetchCollections();
    fetchProducts();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${config.API_URL}/api/master/getSkuCollections/`
      );
      setCollections(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching collections", error);
      toast.error("Failed to load collections");
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const productResponse = await axios.get(
        `${config.API_URL}/api/master/getProduct/`
      );
      const productCollectionsResponse = await axios.get(
        `${config.API_URL}/api/master/getSkuProduct/`
      );

      const productData = productResponse.data;
      const productCollectionsData = productCollectionsResponse.data || [];

      // Merge collection data into product details
      const mergedData = productData.map((product) => {
        const productCollections = productCollectionsData
          .filter((pc) => pc.productId === product._id)
          .map((pc) => pc.skuId);

        return {
          ...product,
          image: product.images?.image1 || "https://via.placeholder.com/150",
          collections: productCollections,
        };
      });

      setProducts(mergedData);
    } catch (error) {
      console.error("Error fetching products", error);
      toast.error("Failed to load products");
    }
  };

  const handleViewCollection = (collection) => {
    setCurrentCollection(collection);

    // Find all products in this collection
    const productsInCollection = products.filter(
      (product) =>
        product.collections && product.collections.includes(collection._id)
    );

    setCollectionProducts(productsInCollection);
    setShowViewModal(true);
  };

  const handleEditCollection = (collection) => {
    setEditingCollection(collection);
    setCollectionName(collection.name);

    // Find all products in this collection
    const productsInCollection = products.filter(
      (product) =>
        product.collections && product.collections.includes(collection._id)
    );

    setCollectionProducts(productsInCollection);

    // Set available products (those not in the collection)
    const otherProducts = products.filter(
      (product) =>
        !product.collections || !product.collections.includes(collection._id)
    );

    setAvailableProducts(otherProducts);
    setShowEditModal(true);
  };

  const saveCollection = async () => {
    if (!collectionName.trim()) {
      toast.error("Collection name cannot be empty");
      return;
    }

    try {
      // Update collection name
      await axios.put(
        `${config.API_URL}/api/master/updateSkuCollection/${editingCollection._id}`,
        {
          name: collectionName,
        }
      );

      // Get current product IDs in the collection
      const currentProductIds = products
        .filter(
          (product) =>
            product.collections &&
            product.collections.includes(editingCollection._id)
        )
        .map((product) => product._id);

      // New product IDs in the collection
      const newProductIds = collectionProducts.map((product) => product._id);

      // Products to remove (in current but not in new)
      const productsToRemove = currentProductIds.filter(
        (id) => !newProductIds.includes(id)
      );

      // Products to add (in new but not in current)
      const productsToAdd = newProductIds.filter(
        (id) => !currentProductIds.includes(id)
      );

      // Remove products from collection
      for (const productId of productsToRemove) {
        await axios.post(
          `${config.API_URL}/api/master/removeSkuProduct/`,{productId,skuId:editingCollection._id}
        );
      }

      // Add products to collection
      for (const productId of productsToAdd) {
        await axios.post(`${config.API_URL}/api/master/addSkuProduct/`, {
          productId,
          skuId: editingCollection._id,
        });
      }

      setShowEditModal(false);
      fetchCollections();
      fetchProducts();
      toast.success("Collection updated successfully");
    } catch (error) {
      console.error("Error updating collection", error);
      toast.error("Failed to update collection");
    }
  };

  const deleteCollection = async (id) => {
    try {
      // First, delete all SKU product associations
      const productCollections = products
        .filter(
          (product) => product.collections && product.collections.includes(id)
        )
        .map((product) => product._id);

      for (const productId of productCollections) {
        await axios.post(
          `${config.API_URL}/api/master/removeSkuProduct/`,{productId,skuId:id}
        );
      }

      // Then delete the collection itself
      await axios.delete(
        `${config.API_URL}/api/master/deleteSkuCollection/${id}`
      );

      fetchCollections();
      fetchProducts();
      setConfirmDeleteId(null);
      toast.success("Collection deleted successfully");
    } catch (error) {
      console.error("Error deleting collection", error);
      toast.error("Failed to delete collection");
    }
  };

  const addProductToCollection = (product) => {
    setCollectionProducts([...collectionProducts, product]);
    setAvailableProducts(
      availableProducts.filter((p) => p._id !== product._id)
    );
  };

  const removeProductFromCollection = (product) => {
    setCollectionProducts(
      collectionProducts.filter((p) => p._id !== product._id)
    );
    setAvailableProducts([...availableProducts, product]);
  };

  // Filter collections based on search query
  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter available products based on search in the modal
  const filteredAvailableProducts = availableProducts.filter(
    (product) =>
      product.styleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.category &&
        product.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="mr-4  text-gray-600 hover:text-gray-800"
          >
            <FaChevronLeft size={20} />
          </button>
        </div>
        <div>
          <h1 className="text-3xl  font-bold">
            SKU Collection Management
          </h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          className="ml-4 bg-[#310b6b] text-white px-6 py-2 rounded-lg hover:bg-[#4a1d8a] transition-colors font-semibold flex items-center"
          onClick={() => navigate("/sku")}
        >
          <FaPlus className="mr-2" /> Create New SKU
        </button>
      </div>

      {/* Collections Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Collection Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Products Count
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  Loading collections...
                </td>
              </tr>
            ) : filteredCollections.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No collections found
                </td>
              </tr>
            ) : (
              filteredCollections.map((collection) => {
                // Count products in this collection
                const productCount = products.filter(
                  (product) =>
                    product.collections &&
                    product.collections.includes(collection._id)
                ).length;

                return (
                  <tr key={collection._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {collection.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{productCount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">
                        {new Date(collection.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewCollection(collection)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <FaEye size={18} />
                      </button>
                      <button
                        onClick={() => handleEditCollection(collection)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <FaEdit size={18} />
                      </button>
                      {confirmDeleteId === collection._id ? (
                        <>
                          <button
                            onClick={() => deleteCollection(collection._id)}
                            className="text-red-600 hover:text-red-900 mr-1"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(collection._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* View Collection Modal */}
      {showViewModal && currentCollection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {currentCollection.name} - Products
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {collectionProducts.length === 0 ? (
              <p className="text-gray-500 py-4">
                No products in this collection
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {collectionProducts.map((product) => (
                  <div
                    key={product._id}
                    className="border rounded-lg p-3 shadow-sm"
                  >
                    <img
                      src={`${config.API_URL}${product.image}`}
                      alt={product.styleName}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <h5 className="mt-2 font-medium truncate">
                      {product.styleName}
                    </h5>
                    <p className="text-sm text-gray-600">{product.category}</p>
                    <p className="text-sm font-bold">₹{product.price}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Collection Modal */}
      {showEditModal && editingCollection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Edit Collection</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Collection Name
              </label>
              <input
                type="text"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Products */}
              <div>
                <h4 className="font-semibold mb-2">
                  Current Products ({collectionProducts.length})
                </h4>
                <div className="border rounded-lg p-3 bg-blue-50 h-96 overflow-y-auto">
                  {collectionProducts.length === 0 ? (
                    <p className="text-gray-500 py-4 text-center">
                      No products in this collection
                    </p>
                  ) : (
                    collectionProducts.map((product) => (
                      <div
                        key={product._id}
                        className="flex items-center justify-between p-2 border-b last:border-0 hover:bg-blue-100"
                      >
                        <div className="flex items-center">
                          <img
                            src={`${config.API_URL}${product.image}`}
                            alt={product.styleName}
                            className="w-12 h-12 object-cover rounded mr-3"
                          />
                          <div>
                            <p className="font-medium">{product.styleName}</p>
                            <p className="text-xs text-gray-600">
                              {product.category}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeProductFromCollection(product)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Available Products */}
              <div>
                <h4 className="font-semibold mb-2">Available Products</h4>
                <div className="mb-2">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="border rounded-lg p-3 bg-gray-50 h-80 overflow-y-auto">
                  {filteredAvailableProducts.length === 0 ? (
                    <p className="text-gray-500 py-4 text-center">
                      No products available or matching search
                    </p>
                  ) : (
                    filteredAvailableProducts.map((product) => (
                      <div
                        key={product._id}
                        className="flex items-center justify-between p-2 border-b last:border-0 hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <img
                            src={`${config.API_URL}${product.image}`}
                            alt={product.styleName}
                            className="w-12 h-12 object-cover rounded mr-3"
                          />
                          <div>
                            <p className="font-medium">{product.styleName}</p>
                            <p className="text-xs text-gray-600">
                              {product.category}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => addProductToCollection(product)}
                          className="text-green-500 hover:text-green-700"
                        >
                          <FaPlus size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={saveCollection}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
              >
                <FaSave className="mr-2" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSku;
