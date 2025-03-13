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
