import Size from "../../model/Master/Size.model.js"

export const createSize = async(req,res)=>{
  try {
    const { sizeName, sizes } = req.body;

    if (!sizeName || !sizes || !Array.isArray(sizes)) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const newSize = new Size({ sizeName, sizes });
    await newSize.save();

    res
      .status(201)
      .json({ message: "Size data saved successfully", data: newSize });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
}

export const updateSize = async(req,res)=>{

     console.log("inside update size")
      try {
        const { id } = req.params;
        const { sizeName, sizes } = req.body;

        // Validate request data
        if (!sizeName || !Array.isArray(sizes)) {
          return res.status(400).json({ error: "Invalid input data" });
        }

        // Find and update the document
        const updatedSize = await Size.findByIdAndUpdate(
          id,
          { sizeName, sizes },
          { new: true, runValidators: true }
        );

        if (!updatedSize) {
          return res.status(404).json({ error: "Size not found" });
        }

        res
          .status(200)
          .json({ message: "Size updated successfully", data: updatedSize });
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .json({ error: "Update failed", details: error.message });
      }
}

export const getSizes = async(req,res)=>{
      try {
        const sizes = await Size.find();
        res.status(200).json(sizes);
      } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
      }
}

export const deleteSize = async(req,res)=>{
      try {
        const { id } = req.params;

        const deletedSize = await Size.findByIdAndDelete(id);

        if (!deletedSize) {
          return res.status(404).json({ error: "Size entry not found" });
        }

        res.status(200).json({ message: "Size entry deleted successfully" });
      } catch (error) {
        res
          .status(500)
          .json({
            error: "Failed to delete size entry",
            details: error.message,
          });
      }
}