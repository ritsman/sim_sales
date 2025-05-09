import { Process } from "../../model/Master/Process.model.js";

export const addProcess = async(req,res)=>{
  try {
    const { processName, activities,group } = req.body;
    const newProcess = new Process({ processName, activities,group });
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

export const getProcessById = async(req,res)=>{
  const {id} = req.params;
   try {
     const processes = await Process.findById(id);
     res.status(200).json(processes);
   } catch (error) {
     res.status(500).json({ message: "Error fetching processes", error });
   }
}

export const updateProcess = async(req,res)=>{
  try {
    const { processName, activities, group } = req.body;

    // You might want to validate the input here

    const updatedProcess = await Process.findByIdAndUpdate(
      req.params.id,
      {
        processName,
        activities,
        group,
        // You might want to add updatedAt: Date.now() if you track that
      },
      { new: true } // This returns the updated document
    );

    if (!updatedProcess) {
      return res.status(404).json({ message: "Process not found" });
    }

    res.json(updatedProcess);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const deleteProcess = async(req,res)=>{
  try {
    await Process.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Process deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting process", error });
  }
}