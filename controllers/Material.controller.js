// import { pool } from "../mysql/mysql.js";
import {GRN} from "../model/material/GRN.model.js";
import {GSN} from "../model/material/GSN.model.js";
import {PurchaseOrder} from "../model/material/PO.model.js";


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


