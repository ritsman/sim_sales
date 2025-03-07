// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config";

// const AddProduct = () => {
//   const navigate = useNavigate();

//   // State for form fields
//   const [styleName, setStyleName] = useState("");
//   const [reference, setReference] = useState("");
//   const [season, setSeason] = useState("");
//   const [category, setCategory] = useState("");
//   const [hsnCode, setHsnCode] = useState("");
//   const [price, setPrice] = useState("");
//   const [size, setSize] = useState("");
//   const [image, setImage] = useState(null); // Store image file
//   const [previewImage, setPreviewImage] = useState(null); // Store image preview

//   // State for dropdown options
//   const [categories, setCategories] = useState([]);
//   const [sizes, setSizes] = useState([]);

//   // Fetch dropdown options from database
//   useEffect(() => {
//     const fetchDropdownData = async () => {
//       try {
//         const categoryRes = await axios.get(`${config.API_URL}/api/master/getGroup`);
//         const sizeRes = await axios.get(
//           `${config.API_URL}/api/master/getSizes`
//         );

//         console.log(sizeRes,categoryRes);
//         setCategories(categoryRes.data);
//         setSizes(sizeRes.data);
//       } catch (error) {
//         console.error("Error fetching dropdown data:", error);
//       }
//     };
//     fetchDropdownData();
//   }, []);

//   // Handle image selection
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setImage(file);

//     // Preview Image
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setPreviewImage(reader.result);
//     };
//     if (file) {
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("styleName", styleName);
//     formData.append("reference", reference);
//     formData.append("season", season);
//     formData.append("category", category);
//     formData.append("hsnCode", hsnCode);
//     formData.append("price", price);
//     formData.append("size", size);
//     if (image) formData.append("image", image); // Add image file if selected

//     try {
//       await axios.post(`${config.API_URL}/api/master/createProduct`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("Product added successfully!");
//       navigate(-1); // Redirect to product list page
//     } catch (error) {
//       console.error("Error saving product:", error);
//       alert("Failed to save product!");
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
//       <h2 className="text-3xl font-bold mb-6 text-gray-700 text-center">
//         Add Product
//       </h2>

//       <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
//         {/* Style Name */}
//         <div>
//           <label className="block font-semibold text-gray-600">
//             Style Name
//           </label>
//           <input
//             type="text"
//             className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-300"
//             value={styleName}
//             onChange={(e) => setStyleName(e.target.value)}
//           />
//         </div>

//         {/* Reference */}
//         <div>
//           <label className="block font-semibold text-gray-600">Reference</label>
//           <input
//             type="text"
//             className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-300"
//             value={reference}
//             onChange={(e) => setReference(e.target.value)}
//           />
//         </div>

//         {/* Season */}
//         <div>
//           <label className="block font-semibold text-gray-600">Season</label>
//           <input
//             type="text"
//             className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-300"
//             value={season}
//             onChange={(e) => setSeason(e.target.value)}
//           />
//         </div>

//         {/* Category Dropdown */}
//         <div>
//           <label className="block font-semibold text-gray-600">Category</label>
//           <select
//             className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-300"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//           >
//             <option value="">Select Category</option>
//             {categories.map((cat) => (
//               <option key={cat._id} value={cat.name}>
//                 {cat.groupName}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* HSN Code */}
//         <div>
//           <label className="block font-semibold text-gray-600">HSN Code</label>
//           <input
//             type="text"
//             className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-300"
//             value={hsnCode}
//             onChange={(e) => setHsnCode(e.target.value)}
//           />
//         </div>

//         {/* Price */}
//         <div>
//           <label className="block font-semibold text-gray-600">Price</label>
//           <input
//             type="number"
//             className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-300"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//           />
//         </div>

//         {/* Size Dropdown */}
//         <div>
//           <label className="block font-semibold text-gray-600">Size</label>
//           <select
//             className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-300"
//             value={size}
//             onChange={(e) => setSize(e.target.value)}
//           >
//             <option value="">Select Size</option>
//             {sizes.map((sz) => (
//               <option key={sz._id} value={sz.sizeName}>
//                 {sz.sizeName}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Image Upload */}
//         <div className="col-span-2">
//           <label className="block font-semibold text-gray-600">
//             Product Image
//           </label>
//           <input
//             type="file"
//             accept="image/*"
//             className="block w-full text-sm text-gray-500 
//                     file:mr-4 file:py-2 file:px-4
//                     file:rounded-lg file:border-0
//                     file:text-sm file:font-semibold
//                     file:bg-blue-50 file:text-blue-700
//                     hover:file:bg-blue-100 cursor-pointer"
//             onChange={handleImageChange}
//           />
//           {previewImage && (
//             <img
//               src={previewImage}
//               alt="Preview"
//               className="mt-4 h-32 w-32 object-cover rounded"
//             />
//           )}
//         </div>

//         {/* Buttons (Full width row) */}
//         <div className="col-span-2 flex justify-between mt-6">
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
//           >
//             Back
//           </button>

//           <button
//             type="submit"
//             className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
//           >
//             Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddProduct;


import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import config from "../../../config";

const AddProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingProduct = location.state?.product || null; // Check if editing

  // State for form fields
  const [styleName, setStyleName] = useState("");
  const [reference, setReference] = useState("");
  const [season, setSeason] = useState("");
  const [category, setCategory] = useState("");
  const [hsnCode, setHsnCode] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState({});
  // const [image, setImage] = useState(null); // Store image file
  // const [previewImage, setPreviewImage] = useState(null); // Store image preview

   const [images, setImages] = useState({
     image1: null,
     image2: null,
     image3: null,
   });
   const [previewImages, setPreviewImages] = useState({
     image1: null,
     image2: null,
     image3: null,
   });

  // State for dropdown options
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);

 const options2 = [
   { _id: 1, code: "A1000", groupName: "group1", under: "Primary" },
   { _id: 2, code: "B1000", groupName: "group2", under: "Primary" },
 ];

  // Pre-fill form if editing
  useEffect(() => {
    if (editingProduct) {
      setStyleName(editingProduct.styleName);
      setReference(editingProduct.reference);
      setSeason(editingProduct.season);
      setCategory(editingProduct.category);
      setHsnCode(editingProduct.hsnCode);
      setPrice(editingProduct.price);
      setSize(editingProduct.size);
      console.log(editingProduct.image)
    //  if (editingProduct.image) {
    //    setPreviewImage(`${config.API_URL}${editingProduct.image}`); // ✅ Add backend URL
    //  }
       if (editingProduct.images) {
         setPreviewImages({
           image1: editingProduct.images.image1
             ? `${config.API_URL}${editingProduct.images.image1}`
             : null,
           image2: editingProduct.images.image2
             ? `${config.API_URL}${editingProduct.images.image2}`
             : null,
           image3: editingProduct.images.image3
             ? `${config.API_URL}${editingProduct.images.image3}`
             : null,
         });
       }

    }
  }, [editingProduct]);

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const categoryRes = await axios.get(
          `${config.API_URL}/api/master/getGroup`
        );
        const sizeRes = await axios.get(
          `${config.API_URL}/api/master/getSizes`
        );
        setCategories([...options2,...categoryRes.data]);
        setSizes(sizeRes.data);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };
    fetchDropdownData();
  }, []);

  // Handle image selection
   const handleImageChange = (e, fieldName) => {
     const file = e.target.files[0];
     setImages((prev) => ({ ...prev, [fieldName]: file }));

     const reader = new FileReader();
     reader.onloadend = () => {
       setPreviewImages((prev) => ({ ...prev, [fieldName]: reader.result }));
     };
     if (file) {
       reader.readAsDataURL(file);
     }
   };
  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   setImage(file);

  //   // Preview Image
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     setPreviewImage(reader.result);
  //   };
  //   if (file) {
  //     reader.readAsDataURL(file);
  //   }
  // };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("styleName", styleName);
    formData.append("reference", reference);
    formData.append("season", season);
    formData.append("category", category);
    formData.append("hsnCode", hsnCode);
    formData.append("price", price);
    formData.append("size", JSON.stringify(size)); // Convert object to JSON string
    // if (image) formData.append("image", image); // Add image file if selected
     Object.keys(images).forEach((key) => {
       if (images[key]) formData.append(key, images[key]);
     });

    try {
      if (editingProduct) {
        // Console log FormData entries
        console.log("FormData values:");
        for (let pair of formData.entries()) {
          console.log(pair[0], pair[1]);
        } // Update existing product
        await axios.put(
          `${config.API_URL}/api/master/updateProduct/${editingProduct._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        alert("Product updated successfully!");
      } else {
        // Create new product
        await axios.post(
          `${config.API_URL}/api/master/createProduct`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        alert("Product added successfully!");
      }
      navigate(-1);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product!");
    }
  };

  useEffect(()=>{
console.log(size,"size");
  },[size])

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-700 text-center">
        {editingProduct ? "Edit Product" : "Add Product"}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        {/* Style Name */}
        <div>
          <label className="block font-semibold text-gray-600">
            Style Name
          </label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-300"
            value={styleName}
            onChange={(e) => setStyleName(e.target.value)}
          />
        </div>

        {/* Reference */}
        <div>
          <label className="block font-semibold text-gray-600">Reference</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-300"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
        </div>

        {/* Season */}
        <div>
          <label className="block font-semibold text-gray-600">Season</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-300"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block font-semibold text-gray-600">Category</label>
          <select
            className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-300"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.groupName}
              </option>
            ))}
          </select>
        </div>

        {/* HSN Code */}
        <div>
          <label className="block font-semibold text-gray-600">HSN Code</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-300"
            value={hsnCode}
            onChange={(e) => setHsnCode(e.target.value)}
          />
        </div>

        {/* Price */}
        <div>
          <label className="block font-semibold text-gray-600">Price</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-300"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {/* Size Dropdown */}
        <div>
          <label className="block font-semibold text-gray-600">Size</label>
          <select
            className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-300"
            value={JSON.stringify(size)} // Convert object to string for selection
            onChange={(e) => setSize(JSON.parse(e.target.value))} // Parse string back to object
          >
            <option value="">Select Size</option>
            {sizes.map((sz) => (
              <option key={sz._id} value={JSON.stringify(sz)}>
                {sz.sizeName}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div className="col-span-2  grid grid-cols-3">
          <div>
            <label className="block font-semibold text-gray-600">
              Main Image 
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "image1")}
              className="block w-full text-sm text-gray-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-lg file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-blue-50 file:text-blue-700
                                  hover:file:bg-blue-100 cursor-pointer"
            />
            {previewImages.image1 && (
              <img
                src={previewImages.image1}
                alt="Preview"
                className="mt-4 h-32 w-32 object-cover rounded"
              />
            )}
          </div>
          <div>
            <label className="block font-semibold text-gray-600">
              Product Image 2
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "image2")}
              className="block w-full text-sm text-gray-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-lg file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-blue-50 file:text-blue-700
                                  hover:file:bg-blue-100 cursor-pointer"
            />
            {previewImages.image2 && (
              <img
                src={previewImages.image2}
                alt="Preview"
                className="mt-4 h-32 w-32 object-cover rounded"
              />
            )}
          </div>
          <div>
            <label className="block font-semibold text-gray-600">
              Product Image 3
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "image3")}
              className="block w-full text-sm text-gray-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-lg file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-blue-50 file:text-blue-700
                                  hover:file:bg-blue-100 cursor-pointer"
            />
            {previewImages.image3 && (
              <img
                src={previewImages.image3}
                alt="Preview"
                className="mt-4 h-32 w-32 object-cover rounded"
              />
            )}
          </div>
        </div>
       

        {/* Buttons */}
        <div className="col-span-2 flex justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gray-500 text-white rounded-lg"
          >
            {editingProduct ? "Update Product" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
