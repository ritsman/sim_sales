import Unit from "../../model/Master/Unit.model.js";

export const createUnit = async(req,res)=>{
  try {
    const { unitName, shortName } = req.body;

    if (!unitName || !shortName) {
      return res
        .status(400)
        .json({ message: "Unit name and short name are required" });
    }

    // Check if the unit already exists
    const existingUnit = await Unit.findOne({
      $or: [{ unitName }, { shortName }],
    });

    if (existingUnit) {
      return res
        .status(400)
        .json({ message: "Unit name or short name already exists" });
    }

    const newUnit = new Unit({ unitName, shortName });
    await newUnit.save();

    res
      .status(201)
      .json({ message: "Unit created successfully", unit: newUnit });
  } catch (error) {
    console.error("Error creating unit:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const updateUnit = async (req, res) => {

    try {
   const updateUnit = await Unit.findByIdAndUpdate(req.params.id, req.body, {
     new: true,
   });
   if (!updateUnit) {
     return res.status(404).json({ message: "unit not found" });
   }
   res.status(200).json(updateUnit);
 } catch (error) {
   res.status(500).json({ error: error.message });
 }
};


export const getUnit = async(req,res)=>{
  try {
    const units = await Unit.find().sort({ createdAt: -1 });
    res.status(200).json(units);
  } catch (error) {
    console.error("Error fetching units:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const deleteUnit = async(req,res)=>{
  try {
    const { id } = req.params;
    const deletedUnit = await Unit.findByIdAndDelete(id);

    if (!deletedUnit) {
      return res.status(404).json({ message: "Unit not found" });
    }

    res.status(200).json({ message: "Unit deleted successfully" });
  } catch (error) {
    console.error("Error deleting unit:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}