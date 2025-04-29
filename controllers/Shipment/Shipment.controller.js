import Stock from "../../model/Gallery/Stock.model.js";
import Shipment from "../../model/Shipment/Shipment.model.js";

export const outStock = async(req,res)=>{
  try {
    const { products } = req.body; // type: "IN" or "OUT"

    const transactions = [];

    products.forEach((product) => {
     

      transactions.push({
        productId: product.productId,
        type: "OUT",
        sizes: product.sizes,
        date: new Date(),
        reference: "Out Orders",
      });
    });

    await Stock.insertMany(transactions);

    res.json({ success: true, message: "Stock dispatched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

export const createShipment = async (req, res) => {
  console.log("Inside create shipment", req.body);

  try {
    const shipments = req.body; // Expecting an array

    if (!Array.isArray(shipments) || shipments.length === 0) {
      return res
        .status(400)
        .json({
          message: "Invalid data format. Expected an array of shipments.",
        });
    }

    // Validate each shipment
    const formattedShipments = shipments.map(({ order_no, products }) => {
      if (!order_no || !products || !Array.isArray(products)) {
        throw new Error("Invalid shipment data");
      }

      return {
        order_no,
        shipment_date: new Date(),
        products,
        dispatch_type: "OUT",
        createdAt: new Date(),
      };
    });

    // Insert multiple shipments at once
    const savedShipments = await Shipment.insertMany(formattedShipments);

    res
      .status(201)
      .json({ message: "Shipments saved successfully", savedShipments });
  } catch (error) {
    console.error("Error saving shipment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getShipment = async(req,res)=>{
 try {
   // Fetch all shipments from the database
   const shipments = await Shipment.find();

//    if (!shipments || shipments.length === 0) {
//      return res.status(404).json({ message: "No shipments found." });
//    }

   // Format the shipments properly
   const formattedShipments = shipments.map((shipment) => ({
     order_no: shipment.order_no,
     shipment_date: shipment.shipment_date,
     dispatch_type: shipment.dispatch_type,
     products: shipment.products.map((product) => ({
       productId: product.productId, // No need to change, already stored correctly
       size: product.size,
       styleName:product.description,
       quantity:product.quantity,
       unitPrice:product.unitPrice,
       amount:product.amount,
       dispatched_quantity: product.dispatched_quantity,
     })),
     createdAt: shipment.createdAt,
   }));

   res.status(200).json(formattedShipments);
 } catch (error) {
   console.error("Error fetching shipments:", error);
   res.status(500).json({ message: "Internal Server Error" });
 }
}
export const getDispatched = async (req, res) => {
  try {
    const { orderNo } = req.params; // Extract orderNo from request params

    if (!orderNo) {
      return res.status(400).json({ message: "Order number is required" });
    }

    // Fetch shipments for the given order number
    const shipments = await Shipment.find({ order_no: orderNo });

    // if (!shipments || shipments.length === 0) {
    //   return res
    //     .status(404)
    //     .json({ message: "No shipments found for this order." });
    // }

    // Format the shipments properly
    const formattedShipments = shipments.map((shipment) => ({
      order_no: shipment.order_no,
      shipment_date: shipment.shipment_date,
      dispatch_type: shipment.dispatch_type,
      products: shipment.products.map((product) => ({
        productId: product.productId,
        size: product.size,
        dispatched_quantity: product.dispatched_quantity,
      })),
      createdAt: shipment.createdAt,
    }));

    res.status(200).json(formattedShipments);
  } catch (error) {
    console.error("Error fetching shipments:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


//invoice

import mongoose from "mongoose";
import { Counter
 } from "../../model/Shipment/Counter.model.js";
 import { Invoice } from "../../model/Shipment/Shipment.model.js";
 import SalesOrder from "../../model/Sales/Sales.model.js";
 import Party from "../../model/Master/Party.model.js";

const generateInvoiceNumber = async () => {
  const financialYear =
    new Date().getMonth() >= 3
      ? `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`.slice(-2)
      : `${new Date().getFullYear() - 1}-${new Date().getFullYear()}`.slice(-2);

  // Find and update counter for invoices
  const counter = await Counter.findOneAndUpdate(
    { type: "invoice" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  // Format: INV/FY/0001
  return `INV/${financialYear}/${counter.seq.toString().padStart(4, "0")}`;
};

export const createInvoice = async(req,res)=>{
   

    try {
      const {
        orderNo,
        partyId,
        deliveryDestination,
        items,
        subtotal,
        gstAmount,
        totalAmount,
        invoiceDate,
        status,
      } = req.body;

      // Validate required fields
      if (!orderNo || !partyId || !items || items.length === 0) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Check if order exists
      const order = await SalesOrder.findOne({ order_no: orderNo })
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Check if party exists
      const party = await Party.findById(partyId);
      if (!party) {
        return res.status(404).json({ message: "Party not found" });
      }

      // Generate invoice number
      const invoiceNumber = await generateInvoiceNumber();

      // Create new invoice
      const newInvoice = new Invoice({
        invoiceNumber,
        invoiceDate: invoiceDate || new Date(),
        orderNo,
        partyId,
        partyName: party.companyName,
        partyGstin: party.gst,
        partyAddress: party.address,
        deliveryDestination,
        items: items.map((item) => ({
          productId: item.productId,
          styleName: item.styleName,
          color: item.color,
          size: item.size,
          quantity: item.dispatchedQty,
          price: item.price,
          gstRate: item.gstRate,
          gstAmount: item.gstAmount,
          totalPrice: item.totalPrice,
        })),
        subtotal,
        gstAmount,
        totalAmount,
        status: status || "CREATED",
        createdBy: req.user ? req.user._id : null,
      });

      await newInvoice.save();

      // Update order to mark items as invoiced if needed
      // This is optional and depends on your business logic
      order.invoiceStatus = "INVOICED";
      order.lastInvoiceDate = new Date();
      await order.save();


      res.status(201).json({
        message: "Invoice created successfully",
        invoiceId: newInvoice._id,
        invoiceNumber,
      });
    } catch (error) {
      console.error("Error creating invoice:", error);
      res.status(500).json({
        message: "Failed to create invoice",
        error: error.message,
      });
    } 
}
