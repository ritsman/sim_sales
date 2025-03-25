import Color from "../../model/Master/Color.model.js";
export const createColor = async (req,res)=>{
      try {
        const { colorName, hex } = req.body;
        const existingColor = await Color.findOne({ colorName });
        if (existingColor) {
          return res.status(400).json({ message: "Color name already exists" });
        }
        const newColor = new Color({ colorName, hex });
        await newColor.save();
        res.status(201).json({ message: "Color added successfully", newColor });
      } catch (error) {
        console.error("Error creating color:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
}

export const getColor = async(req,res)=>{
  try {
    const colors = await Color.find();
    res.status(200).json(colors);
  } catch (error) {
    console.error("Error fetching colors:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const updateColor = async(req,res)=>{
  try {
    const { colorName, hex } = req.body;
    const existingColor = await Color.findOne({
      colorName,
      _id: { $ne: req.params.id },
    });
    if (existingColor) {
      return res.status(400).json({ message: "Color name already exists" });
    }
    const updatedColor = await Color.findByIdAndUpdate(
      req.params.id,
      { colorName, hex },
      { new: true }
    );
    if (!updatedColor) {
      return res.status(404).json({ message: "Color not found" });
    }
    res
      .status(200)
      .json({ message: "Color updated successfully", updatedColor });
  } catch (error) {
    console.error("Error updating color:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const deleteColor = async(req,res)=>{
  try {
    const deletedColor = await Color.findByIdAndDelete(req.params.id);
    if (!deletedColor) {
      return res.status(404).json({ message: "Color not found" });
    }
    res.status(200).json({ message: "Color deleted successfully" });
  } catch (error) {
    console.error("Error deleting color:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}