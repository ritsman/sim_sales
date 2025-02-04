import Sales from "../../model/Sales/Sales.model.js";

export const postSales = async(req,res) =>{
  console.log("inside post sales")
           try {
             const newOrder = new Sales(req.body);
             const savedOrder = await newOrder.save();
             res.status(201).json(savedOrder);
           } catch (error) {
            console.log(error)
             res.status(400).json({ message: error.message });
           }
}

export const getSales = async(req,res) =>{
     try {
       const orders = await Sales.find();
       res.json(orders);
     } catch (error) {
       res.status(500).json({ message: error.message });
     }
}