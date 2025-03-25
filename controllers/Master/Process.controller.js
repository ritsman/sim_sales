import { Process } from "../../model/Master/Process.model.js";

export const addProcess = async(req,res)=>{
  try {
    const { processName, activities } = req.body;
    const newProcess = new Process({ processName, activities });
    await newProcess.save();
    res.status(201).json({ message: "Process added successfully", newProcess });
  } catch (error) {
    res.status(500).json({ message: "Error adding process", error });
  }
}

export const getprocess = async(req,res)=>{
 try {
   const processes = await Process.find();
   res.status(200).json(processes);
 } catch (error) {
   res.status(500).json({ message: "Error fetching processes", error });
 }
}

export const updateProcess = async(req,res)=>{

}

export const deleteProcess = async(req,res)=>{
  try {
    await Process.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Process deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting process", error });
  }
}