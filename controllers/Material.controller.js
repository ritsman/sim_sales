// import { pool } from "../mysql/mysql.js";
import GRN from "../model/material/GRN.model.js";
import GSN from "../model/material/GSN.model.js";
import PurchaseOrder from "../model/material/PO.model.js";

// export const purchaseOrder = async (req, res) => {
//   console.log("reached inside purchase order", req.body);

//   pool.query(
//     `INSERT INTO purchase_order (po_no, address, gst, date, transport, location, date_of_deliver, tnc, discount, freight, sub_total, total_amount, total_quantity)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//     [
//       req.body.po_no,
//       req.body.address,
//       req.body.gst,
//       req.body.date,
//       req.body.transport,
//       req.body.location,
//       req.body.dod,
//       req.body.tNc,
//       req.body.discount,
//       req.body.freight,
//       req.body.sub_total,
//       req.body.total_amount,
//       req.body.total_quantity,
//     ],
//     (err, results) => {
//       if (err) {
//         console.error("Error inserting into purchase_order:", err);
//         return;
//       }
//       res.send("Inserted into purchase_order");
//       console.log("Inserted into purchase_order");
//     }
//   );

//   // Retrieve the inserted po_no
//   const poNo = req.body.po_no;

//   // Insert data into item_details table
//   for (const item of req.body.item_details) {
//     pool.query(
//       `INSERT INTO item_details (po_no, itemName, qty, rate, igst, sgst, cgst, amount)
//                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         poNo,
//         item.item,
//         item.qty,
//         item.rate,
//         item.igst,
//         item.sgst,
//         item.cgst,
//         item.amount,
//       ],
//       (err, results) => {
//         if (err) {
//           console.error("Error inserting into item_details:", err);
//           return;
//         }
//         console.log("Inserted into item_details");
//         res.send("Inserted into item_details");
//       }
//     );
//   }
// };

//get purchase order info

// export const getPurchaseOrder = async (req, res) => {
//   let poNo = req.params.id;

//   const getPurchaseOrderData = (poNo) => {
//     return new Promise((resolve, reject) => {
//       pool.query(
//         `SELECT * FROM purchase_order WHERE po_no = ?`,
//         [poNo],
//         (err, results) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(results[0]); // Assuming there's only one row for a given po_no
//           }
//         }
//       );
//     });
//   };

// const getItemDetailsData = (poNo) => {
//   return new Promise((resolve, reject) => {
//     pool.query(
//       `SELECT * FROM item_details WHERE po_no = ?`,
//       [poNo],`
//       (err, results) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(results);
//         }
//       }
//     );
//   });
// };

//   const formatData = async (poNo) => {
//     try {
//       const purchaseOrderData = await getPurchaseOrderData(poNo);
//       const itemDetailsData = await getItemDetailsData(poNo);

//       const formattedData = {
//         po_no: purchaseOrderData.po_no,
//         address: purchaseOrderData.address,
//         gst: purchaseOrderData.gst,
//         date: purchaseOrderData.date,
//         transport: purchaseOrderData.transport,
//         location: purchaseOrderData.location,
//         dod: purchaseOrderData.date_of_deliver,
//         item_details: itemDetailsData.map((item) => ({
//           item: item.itemName,
//           qty: item.qty,
//           amount: item.amount,
//         })),
//         tNc: purchaseOrderData.tnc,
//         discount: purchaseOrderData.discount,
//         freight: purchaseOrderData.freight,
//       };

//       return formattedData;
//     } catch (error) {
//       console.error("Error formatting data:", error);
//       throw error;
//     }
//   };

//   formatData(poNo)
//     .then((formattedData) => {
//       console.log("Formatted data:", formattedData);
//       res.send(formattedData);
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// };

// Goods Reciept Note
export const postGRN = async (req, res) => {
  console.log("inside GRN");
  try {
    let result = new GRN(req.body);
    result.save();
    res.send("successfully sent data");
  } catch (error) {
    console.log(error);
    res.send("error in storing data", error);
  }
};

export const getGRN = async (req, res) => {
  console.log("inside get GRN");
  try {
    let result = await GRN.find({});
    res.send(result);
  } catch (error) {
    console.log(error);
    res.send("error in receiving data", error);
  }
};

//Goods Sending Note

export const postGSN = async (req, res) => {
  console.log("inside postGSN");
  try {
    let result = new GSN(req.body);
    result.save();
    res.send("successfully sent data");
  } catch (error) {
    console.log(error);
    res.send("error in storing data", error);
  }
};

export const getGSN = async (req, res) => {
  console.log("inside getGSN");
  try {
    let result = await GSN.find({});
    res.send(result);
  } catch (error) {
    console.log(error);
    res.send("error in receiving data", error);
  }
};

// purchase order

export const postPurchaseOrder = async (req, res) => {
  try {
    let result = new PurchaseOrder(req.body);
    result.save();
    res.send("successfully sent data");
  } catch (error) {
    console.log(error);
    res.send("error in storing data", error);
  }
};

export const getPurchaseOrder = async (req, res) => {
  try {
    let result = await PurchaseOrder.find({});
    res.send(result);
  } catch (error) {
    console.log(error);
    res.send("error in receiving data", error);
  }
};
