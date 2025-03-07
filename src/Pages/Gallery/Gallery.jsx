import { useState, useEffect,useRef } from "react";
import axios from "axios";
import config from "../../config";
import { FaTrash, FaEdit, FaTimes, FaPlus  } from "react-icons/fa";

const Gallery = () => {
 const [products, setProducts] = useState([]);

 useEffect(() => {
   fetchProducts();
 }, []);

 const fetchProducts = async () => {
   try {
     const productResponse = await axios.get(
       `${config.API_URL}/api/master/getProduct/`
     );
     const stockResponse = await axios.get(
       `${config.API_URL}/api/gallery/getStock/`
     );

     const productData = productResponse.data;
     const stockData = stockResponse.data;

     // Merge stock data into product details
     //  const mergedData = productData.map((product) => {
     //    const stockEntry =
     //      stockData.find((stock) => stock.productId === product._id) || {};
     //    return {
     //      ...product,
     //      sizes: stockEntry.sizes || {}, // Default to empty object if no stock entry
     //      image: product.images?.image1 || "https://via.placeholder.com/150", // Use first image from images object
     //    };
     //  });

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
           totalUnreserved: 0, // ✅ Added this field
         };
       }

       if (stock.type === "IN") {
         stockMap[stock.productId][size].totalIn += quantity;
       } else if (stock.type === "OUT") {
         stockMap[stock.productId][size].totalOut += quantity;
       } else if (stock.type === "RESERVED") {
         stockMap[stock.productId][size].totalReserved += quantity;
       } else if (stock.type === "UNRESERVED") {
         stockMap[stock.productId][size].totalUnreserved += quantity; // ✅ Deduct unreserved stock
       }
     });
   });

   // Merge stock data into product details
   const mergedData = productData.map((product) => {
     const sizesData = stockMap[product._id] || {};

     // Convert to UI-friendly format
     const sizesObject = Object.keys(sizesData).reduce((acc, size) => {
       acc[size] = Math.max(
         sizesData[size].totalIn -
           sizesData[size].totalOut -
           (sizesData[size].totalReserved - sizesData[size].totalUnreserved), // ✅ Handle unreserved stock
         0 // Ensure stock never goes negative
       );
       return acc;
     }, {});

     return {
       ...product,
       sizes: sizesObject, // Now contains correct availableStock for each size
       image: product.images?.image1 || "https://via.placeholder.com/150",
     };
   });

        console.log(mergedData)
     setProducts(mergedData);
   } catch (error) {
     console.error("Error fetching products and stock data", error);
   }
 };

 return (
   <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
     {products.map((product) => (
       <div
         key={product._id}
         className="border rounded-lg p-4 shadow-lg bg-white"
       >
         <img
           src={`${config.API_URL}${product.image}`}
           alt={product.styleName}
           className="w-full h-40 object-cover rounded"
         />
         <h3 className="text-lg font-bold mt-2">{product.styleName}</h3>
         <p className="text-sm text-gray-600">Category: {product.category}</p>
         <p className="text-sm text-gray-600">Price: ₹{product.price}</p>

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
             {Object.values(product.sizes).reduce((sum, qty) => sum + qty, 0)}
           </span>
         </p>
       </div>
     ))}
   </div>
 );
};

export default Gallery;
