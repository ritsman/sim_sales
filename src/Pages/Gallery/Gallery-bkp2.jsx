import { useState, useEffect, useRef } from "react";
import axios from "axios";
import config from "../../config";
import { FaTrash, FaEdit, FaTimes, FaPlus } from "react-icons/fa";

const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [updateStatus, setUpdateStatus] = useState({ type: "", message: "" });
  const [isSizeDialogOpen, setIsSizeDialogOpen] = useState(false);
  const [newSize, setNewSize] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [formData, setFormData] = useState({
    category: "",
    color: "",
    sizes: [],
    price: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const scrollableRef = useRef(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch(`${config.API_URL}/api/gallery/getGalleryImage`);
      const data = await res.json();
      console.log(data.data);
      setGallery(data.data);
    } catch (error) {
      setError("Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.category.trim()) errors.category = "Category is required";
    if (!formData.color.trim()) errors.color = "Color is required";
    if (!formData.sizes.length) errors.sizes = "At least one size is required";
    if (!formData.price || formData.price <= 0)
      errors.price = "Valid price is required";
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const addSize = () => {
    if (newSize && newQuantity) {
      setFormData((prev) => ({
        ...prev,
        sizes: [
          ...prev.sizes,
          { size: newSize, quantity: parseInt(newQuantity, 10) },
        ],
      }));
      setNewSize("");
      setNewQuantity("");
    }
  };

  const removeSize = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleEdit = (item) => {
    setEditItem(item._id);
    setFormData({
      category: item.category || "",
      color: item.color || "",
      sizes: Array.isArray(item.sizes)
        ? item.sizes.map((s) => ({
            size: s.size || s.value || s,
            quantity: s.quantity || 0,
          }))
        : [],
      price: item.price || "",
    });
    setFormErrors({});

    // Scroll the window to the top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Scroll the internal container to the top smoothly
    if (scrollableRef.current) {
      scrollableRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setUpdateStatus({ type: "loading", message: "Updating item..." });

      const response = await fetch(
        `${config.API_URL}/api/gallery/updateGallery/${editItem}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Update failed");

      await fetchImages();
      setEditItem(null);
      setIsSizeDialogOpen(false);
      setUpdateStatus({
        type: "success",
        message: "Item updated successfully",
      });
      setTimeout(() => setUpdateStatus({ type: "", message: "" }), 3000);
    } catch (error) {
      setUpdateStatus({ type: "error", message: "Failed to update item" });
    }
  };

  const cancelEdit = () => {
    setEditItem(null);
    setFormData({
      category: "",
      color: "",
      sizes: [],
      price: "",
    });
    setFormErrors({});
    setIsSizeDialogOpen(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(
        `${config.API_URL}/api/gallery/deleteGalleryImage/${id}`
      );
      fetchImages();
    } catch (error) {
      console.error("Error deleting item", error);
    }
  };

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Gallery</h2>

        {/* {updateStatus.message && (
         <Alert
           className={`mb-4 ${
             updateStatus.type === "success"
               ? "bg-green-50 text-green-800"
               : updateStatus.type === "error"
               ? "bg-red-50 text-red-800"
               : "bg-blue-50 text-blue-800"
           }`}
         >
           <AlertDescription>{updateStatus.message}</AlertDescription>
         </Alert>
       )} */}

        {editItem && (
          <form
            onSubmit={handleUpdate}
            className="mb-6 p-6 bg-gray-50  rounded-lg shadow-lg border border-gray-300"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Edit Item</h3>
              <button
                type="button"
                onClick={cancelEdit}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`block w-full p-2 border rounded ${
                    formErrors.category ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.category && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.category}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="color"
                  placeholder="Color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className={`block w-full p-2 border rounded ${
                    formErrors.color ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.color && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.color}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sizes and Quantities
                </label>
                <div className="mb-2">
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Size"
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      className="border p-2 flex-1 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(e.target.value)}
                      className="border p-2 flex-1 rounded"
                    />
                    <button
                      type="button"
                      onClick={addSize}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {formData.sizes.map((size, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-50 p-2 rounded"
                    >
                      <span className="flex-1">
                        {size.size}: {size.quantity} units
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSize(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                {formErrors.sizes && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.sizes}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`block w-full p-2 border rounded ${
                    formErrors.price ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.price && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.price}
                  </p>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 flex-1"
                  disabled={updateStatus.type === "loading"}
                >
                  {updateStatus.type === "loading" ? "Updating..." : "Update"}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded shadow hover:bg-gray-400 flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        <div
          ref={scrollableRef}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {gallery.map((item) => (
            <div
              key={item._id}
              className="relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
            >
              <button
                className="absolute top-2 right-16 bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 transition-colors"
                onClick={() => handleEdit(item)}
              >
                <FaEdit />
              </button>
              <button
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                onClick={() => handleDelete(item._id)}
              >
                <FaTrash />
              </button>
              <img
                src={`${config.API_URL}${item.image}`}
                alt={item.category}
                className="w-full h-60 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Style Name : {item.styleName}
                </h3>
                <p className="text-sm font-semibold text-gray-600">
                  Category : {item.category}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-bold mr-4">Color:</span> {item.color}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-bold mr-4">Sizes & Qty:</span>
                  {item.sizes.map((s) => (
                    <span className="mr-3 border px-1 py-1">
                      {s.size}:{s.quantity}
                    </span>
                  ))}
                </p>
                <p className="text-lg font-bold text-blue-600">₹{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
