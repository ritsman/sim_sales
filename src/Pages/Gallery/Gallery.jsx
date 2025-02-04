import { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import { FaTrash } from "react-icons/fa"; // Import trash icon

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get(
        `${config.API_URL}/api/gallery/getGalleryImage`
      );
      setImages(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select an image!");

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      await axios.post(
        `${config.API_URL}/api/gallery/postGalleryImage`,
        formData
      );
      fetchImages(); // Refresh images
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      await axios.delete(
        `${config.API_URL}/api/gallery/deleteGalleryImage/${id}`
      );
      fetchImages(); // Refresh images after delete
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Stylish Header */}
      <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-gray-400 to-gray-600 text-white py-3 rounded-lg shadow-md">
        📸 Image Gallery
      </h2>

      {/* Upload Section */}
      <div className="flex items-center justify-center gap-x-24 mt-6">
        <div>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100 cursor-pointer"
          />
        </div>

        <div>
          <button
            onClick={handleUpload}
            className="bg-gray-600 hover:bg-gray-800 transition-all duration-300 text-white font-bold py-2 px-6 rounded-full shadow-lg cursor-pointer"
          >
            🚀 Upload Image
          </button>
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {images.map((img, index) => (
          <div
            key={index}
            className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            {/* Delete Icon (Visible on Hover) */}
            <button
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full 
                         opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={() => handleDelete(img._id)}
            >
              <FaTrash size={16} />
            </button>

            {/* Image */}
            <img
              src={`data:image/png;base64,${img.image}`}
              alt="Uploaded"
              className="w-full h-48 object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
