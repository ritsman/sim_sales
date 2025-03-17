import SalesOrder from "../../model/Sales/Sales.model.js";
import Stock from "../../model/Gallery/Stock.model.js";

export const postSales = async(req,res) =>{
  console.log("inside post sales")
    try {
      const {
        order_no,
        buyer,
        shipment_destination,
        whatsapp_number,
        shipment_type,
        confirm_date,
        entry_date,
        grandTotal,
        agent,
        factory_location,
        ex_factory_date,
        commission,
        payment_terms,
        delivery_terms,
        delivery_date,
        products,
      } = req.body;

      console.log(products)

      // Validate required fields
      if (!order_no || !buyer || !products || products.length === 0) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newOrder = new SalesOrder({
        order_no,
        buyer,
        shipment_destination,
        whatsapp_number,
        shipment_type,
        confirm_date,
        entry_date,
        agent,
        grandTotal,
        factory_location,
        ex_factory_date,
        commission,
        payment_terms,
        delivery_terms,
        delivery_date,
        products,
      });

      const savedOrder = await newOrder.save();
      res.status(201).json(savedOrder);
    } catch (error) {
      console.error("Error saving order:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getSales = async(req,res) =>{
     try {
       const orders = await SalesOrder.find();
       res.json(orders);
     } catch (error) {
       res.status(500).json({ message: error.message });
     }
}


export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // 1️⃣ Find the order
    const order = await SalesOrder.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    console.log("Fetched Order:", order); // Debugging

    let transactions = [];

    // 2️⃣ Restore stock for each product
    for (const product of order.products) {

              const sizesArray = Object.entries(product.sizes2).map(
                ([size, quantity]) => ({
                  size,
                  quantity,
                })
              );

              transactions.push({
                productId: product._id,
                type: "UNRESERVED",
                sizes: sizesArray,
                date: new Date(),
                reference: "Canceled",
              });

    }

     console.log(transactions,"tran")

         await Stock.insertMany(transactions);


    // 3️⃣ Delete the order
    await SalesOrder.findByIdAndDelete(orderId);

    res.json({
      success: true,
      message: "Order canceled successfully, stock restored.",
    });
  } catch (error) {
    console.error("Error canceling order:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while canceling order" });
  }
};

