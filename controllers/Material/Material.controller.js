import {PurchaseOrder} from "../../model/material/PO.model.js";
import { GRN } from "../../model/material/GRN.model.js";
import { GSN } from "../../model/material/GSN.model.js";

export const createPurchaseOrder = async (req, res) => {
  console.log("inside purchase order", req.body);

  try {
    const { poNumber } = req.body;

    if (!poNumber) {
      return res.status(400).json({ message: "poNumber is required" });
    }

    // Check if a purchase order with the same poNumber exists
    const existingPO = await PurchaseOrder.findOne({ poNumber });

    let savedPO;

    if (existingPO) {
      // Replace (update) the existing document
      savedPO = await PurchaseOrder.findOneAndReplace(
        { poNumber },
        req.body,
        { new: true } // return the modified document
      );
    } else {
      // Create a new purchase order
      const purchaseOrder = new PurchaseOrder(req.body);
      savedPO = await purchaseOrder.save();
    }

    res.status(201).json(savedPO);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};


export const getPurchaseOrder = async(req,res)=>{
     try {
      
       const orders = await PurchaseOrder.find();
       res.json(orders);
     } catch (err) {
       res.status(400).json({ message: err.message });
       console.log(err);
     }
}

export const getPurchaseOrderById = async (req, res) => {
  let id = req.params.id;
  console.log(id,"id")
  try {
    let result = await PurchaseOrder.findById(id);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.send("error in receiving data", error);
  }
};

export const deletePurchaseOrder = async (req, res) => {
  let id = req.params.id;
  console.log(id,"id")
  try {
    let result = await PurchaseOrder.findByIdAndDelete(id);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


//GRN

export const createGRN = async (req, res) => {
  console.log("Inside GRN creation", req.body);

  try {
    const { grnNumber } = req.body;

    if (!grnNumber) {
      return res.status(400).json({ message: "grnNumber is required" });
    }

    // Check if a GRN with the same grnNumber exists
    const existingGRN = await GRN.findOne({ grnNumber });

    let savedGRN;

    if (existingGRN) {
      // Replace (update) the existing document
      savedGRN = await GRN.findOneAndReplace(
        { grnNumber },
        req.body,
        { new: true } // return the modified document
      );
    } else {
      // Create a new GRN
      const grn = new GRN(req.body);
      savedGRN = await grn.save();
    }

    res.status(201).json(savedGRN);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};



export const getGRN = async(req,res)=>{
 try {
   const orders = await GRN.find();
   res.json(orders);
 } catch (err) {
   res.status(400).json({ message: err.message });
   console.log(err);
 }
}

export const getGRNById = async(req,res)=>{
  let id = req.params.id;
  console.log(id, "id");
  try {
    let result = await GRN.findById(id);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.send("error in receiving data", error);
  }
}

export const deleteGRN = async(req,res)=>{
  let id = req.params.id;
  console.log(id, "id");
  try {
    let result = await GRN.findByIdAndDelete(id);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

//GSN


export const createGSN = async (req, res) => {
  console.log("Inside GSN creation", req.body);

  try {
    const { gsnNumber } = req.body;

    if (!gsnNumber) {
      return res.status(400).json({ message: "gsnNumber is required" });
    }

    // Check if a GRN with the same grnNumber exists
    const existingGSN = await GSN.findOne({ gsnNumber });

    let savedGSN;

    if (existingGSN) {
      // Replace (update) the existing document
      savedGSN = await GSN.findOneAndReplace(
        { gsnNumber },
        req.body,
        { new: true } // return the modified document
      );
    } else {
      // Create a new GRN
      const gsn = new GSN(req.body);
      savedGSN = await gsn.save();
    }

    res.status(201).json(savedGSN);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

export const getGSN = async (req, res) => {
  try {
    const orders = await GSN.find();
    res.json(orders);
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.log(err);
  }
};

export const getGSNById = async (req, res) => {
  let id = req.params.id;
  console.log(id, "id");
  try {
    let result = await GSN.findById(id);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.send("error in receiving data", error);
  }
};

export const deleteGSN = async (req, res) => {
  let id = req.params.id;
  console.log(id, "id");
  try {
    let result = await GSN.findByIdAndDelete(id);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};