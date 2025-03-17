import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.min.css";
import config from "../../config";

registerAllModules();

const ItemStock = () => {
   const navigate = useNavigate();
   const [items, setItems] = useState([]);

   // Function to handle stock changes in the table
   const handleAfterChange = (changes, source) => {
     if (source === "edit") {
       const updatedItems = [...items];

       changes.forEach(([row, property, oldValue, newValue]) => {
         if (
           property === "stock" &&
           !isNaN(newValue) &&
           newValue !== oldValue
         ) {
           updatedItems[row].stock = parseInt(newValue, 10);
         }
       });

       setItems(updatedItems);
     }
   };

   useEffect(() => {
     const fetchItems = async () => {
       try {
         const response = await axios.get(
           `${config.API_URL}/api/master/getItems`
         );
         const response2 = await axios.get(
           `${config.API_URL}/api/master/getItemStock`
         );

         console.log(response2.data.stockData);

         let a = response.data.map((item) => {
           let stock = response2.data.stockData.find(
             (stock) => stock.itemId == item._id
           );

           console.log(stock);

           return {
             ...item,
             stock: 0,
             availableStock: stock?.availableStock ?? 0,
           };
         });
         setItems(a);
       } catch (error) {
         console.error("Error fetching items:", error);
       }
     };

     fetchItems();
   }, []);

   const columns = [
     { data: "itemName", type: "text", title: "Item Name" },
     { data: "itemType", type: "text", title: "Item Type" },
     { data: "itemColor", type: "text", title: "Item Color" },
     // { data: "itemSelect", type: "text", title: "Item Select" },
     { data: "gst", type: "text", title: "GST (%)" },
     { data: "hsnCode", type: "text", title: "HSN Code" },
     { data: "rate", type: "numeric", title: "Price" },
     { data: "issueUnit", type: "text", title: "Issue Unit" },
     { data: "bufferUnit", type: "numeric", title: "Buffer Unit" },
     // { data: "openingStock", type: "numeric", title: "Opening Stock" },
     // { data: "purchaseUnit", type: "text", title: "Purchase Unit" },
     // {
     //   data: "purchaseIssueRatio",
     //   type: "numeric",
     //   title: "Purchase-Issue Ratio",
     // },
     // { data: "moq", type: "numeric", title: "MOQ" },
     // { data: "msc1", type: "numeric", title: "MSC1" },
     // { data: "msc2", type: "numeric", title: "MSC2" },
     { data: "specification", type: "text", title: "Specification" },
     { data: "user", type: "text", title: "User" },
     { data: "stock", type: "text", title: "add stocks" },
     { data: "availableStock", type: "text", title: "Available Stock" },

     // { data: "createdAt.$date", type: "text", title: "Created At" },
     // { data: "updatedAt.$date", type: "text", title: "Updated At" },
    //  {
    //    data: "actions",
    //    renderer: function (instance, td, row) {
    //      td.innerHTML = `<button class="px-3 py-1 m-1 bg-green-800 text-white rounded hover:bg-green-600">Edit</button>`;
    //      td.querySelector("button").addEventListener("click", () => {
    //        const selectedItem = items[row];
    //        navigate("addItems", { state: { item: selectedItem } });
    //      });
    //    },
    //    title: "Actions",
    //  },
   ];

   const handleSubmitStock = async () => {
     let stocksss = items.map((item) => {
       return {
         itemId: item._id,
         type: "IN",
         quantity: item.stock,
       };
     });
     console.log(stocksss);
     try {
       const response = await axios.post(
         `${config.API_URL}/api/master/addItemStock`,
         stocksss
       );
       console.log(response);
       alert("Stock updated successfully!");
     } catch (error) {
       console.error("Error saving stock:", error);
       alert("Failed to update stock.");
     }
   };

   return (
     <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
       <h2 className="text-xl font-semibold mb-4">Items List</h2>
       <div className="flex gap-5">
         {/* <button
           onClick={() => navigate("addItems")}
           className="mb-4 px-4 py-2 bg-[#310b6b] text-white rounded-md hover:bg-blue-700"
         >
           Add New Item
         </button> */}

         <button
           onClick={handleSubmitStock}
           className="mb-4 px-4 py-2 bg-[#310b6b] text-white rounded-md hover:bg-blue-700"
         >
           Submit stock
         </button>
       </div>

       <HotTable
         data={items}
         colHeaders={columns.map((col) => col.title)}
         columns={columns}
         width="100%"
         height="auto"
         rowHeaders={true}
         manualColumnResize={true}
         afterChange={handleAfterChange}
         licenseKey="non-commercial-and-evaluation"
       />
     </div>
   );
}
 
export default ItemStock;