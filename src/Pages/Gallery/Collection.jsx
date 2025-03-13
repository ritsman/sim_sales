import { useEffect, useState } from "react";
import { FaTrash,FaEdit, FaPlus, FaTimes } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import config from "../../config";
import { useNavigate } from "react-router-dom";

const Collection = () => {
  const navigate = useNavigate();
  const [newCollectionName, setNewCollectionName] = useState("");
  const [collections, setCollections] = useState([]);
  const [collectionToDelete, setCollectionToDelete] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState("all");
    const [editingCollection, setEditingCollection] = useState(null);
    const [updatedCollectionName, setUpdatedCollectionName] = useState("");

  useEffect(() => {
    fetchCollections();
  }, []);

    const updateCollection = async () => {
      if (!updatedCollectionName.trim()) return;
      try {
        await axios.put(
          `${config.API_URL}/api/gallery/updateCollection/${editingCollection._id}`,
          {
            name: updatedCollectionName,
          }
        );
        setEditingCollection(null);
        setUpdatedCollectionName("");
        toast.success("Collection updated successfully");
        fetchCollections();
      } catch (error) {
        console.error("Error updating collection", error);
        toast.error("Error updating collection");
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
      toast.success("Collection added successfully");
      fetchCollections();
    } catch (error) {
      console.error("Error creating collection", error);
      toast.error("Error adding new collection");
    }
  };

  const deleteCollection = async (collectionId) => {
    try {
      await axios.delete(
        `${config.API_URL}/api/gallery/deleteCollection/${collectionId}`
      );
      if (selectedCollection === collectionId) setSelectedCollection("all");
      fetchCollections();
      setShowDeleteConfirmModal(false);
      setCollectionToDelete(null);
    } catch (error) {
      console.error("Error deleting collection", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Create Collection Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Create New Collection
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter collection name"
          />
          <button
            onClick={createCollection}
            className="bg-[#310b6b] text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700"
          >
            <FaPlus className="mr-1" /> Add
          </button>
        </div>
      </div>

      {/* Collections List */}
      {collections.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Manage Collections
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {collections.map((collection) => (
              <div
                key={collection._id}
                className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-md"
              >
                {editingCollection &&
                editingCollection._id === collection._id ? (
                  <input
                    type="text"
                    value={updatedCollectionName}
                    onChange={(e) => setUpdatedCollectionName(e.target.value)}
                    className="p-1 border rounded-md w-full"
                  />
                ) : (
                  <span className="text-gray-700 font-medium">
                    {collection.name}
                  </span>
                )}
                <div className="flex gap-2">
                  {editingCollection &&
                  editingCollection._id === collection._id ? (
                    <button
                      onClick={updateCollection}
                      className="text-green-600 ml-2 hover:text-green-800"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingCollection(collection);
                        setUpdatedCollectionName(collection.name);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit size={14} />
                    </button>
                  )}
                  <button
                    onClick={() =>
                      setCollectionToDelete(collection) ||
                      setShowDeleteConfirmModal(true)
                    }
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Go Back Button */}
      <div className="flex justify-end">
        <button
          className="bg-[#310b6b] text-white px-4 py-2 rounded-md hover:bg-gray-700"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && collectionToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-red-600">
                Delete Collection
              </h3>
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete the collection{" "}
              <strong>{collectionToDelete.name}</strong>? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteCollection(collectionToDelete._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collection;
