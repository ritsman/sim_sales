import WorkOrder from "../../model/WorkOrder.model.js";

export const createWorkOrder = async(req,res)=>{
  try {
    const newWorkOrder = new WorkOrder(req.body);
    await newWorkOrder.save();
    res
      .status(201)
      .json({ message: "Work Order created successfully", data: newWorkOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
}

export const getWorkOrder = async(req,res)=>{
  try {
    const result = await WorkOrder.find({});
    res
      .status(201)
      .json({ message: "Work Order fetched successfully", data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
}

export const deleteWorkOrder = async(req,res)=>{

}

export const updateWorkOrder = async(req,res)=>{

}

export const getLastOrderNo = async(req,res)=>{
    try {
      const currentYear = new Date().getFullYear().toString().slice(-2);
      const yearPrefix = `WO${currentYear}`;

      // Find all work orders with current year prefix and sort by work order number in descending order
      const workOrders = await WorkOrder.find({
        workOrderNo: { $regex: `^${yearPrefix}` },
      })
        .sort({ workOrderNo: -1 }) // Sort in descending order
        .limit(1); // Get only the highest one

      if (workOrders.length > 0) {
        return res.status(200).json({ lastOrderNo: workOrders[0].workOrderNo });
      }

      // If no work orders for current year, check if we have any work orders at all
      // This is optional but gives a better starting point for a new system
      const anyWorkOrder = await WorkOrder.find()
        .sort({ workOrderNo: -1 })
        .limit(1);

      if (anyWorkOrder.length > 0) {
        return res
          .status(200)
          .json({ lastOrderNo: anyWorkOrder[0].workOrderNo });
      }

      // No work orders in the system
      return res.status(200).json({ lastOrderNo: null });
    } catch (error) {
      console.error("Error fetching last order number:", error);
      return res.status(500).json({
        message: "Failed to get last order number",
        error: error.message,
      });
    }
}