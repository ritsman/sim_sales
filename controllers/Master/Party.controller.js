import Party from "../../model/Master/Party.model.js";
export const createParty = async(req,res)=>{
  try {
    const newCompany = new Party(req.body);
    await newCompany.save();
    res
      .status(201)
      .json({ message: "Company created successfully", newCompany });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating company", error });
  }
}

export const updateParty = async(req,res)=>{
  try {
    const updatedCompany = await Party.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Company updated successfully", updatedCompany });
  } catch (error) {
    res.status(500).json({ message: "Error updating company", error });
  }
}

export const getParty = async(req,res)=>{
  try {
    const companies = await Party.find();
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: "Error fetching companies", error });
  }
}

export const deleteParty = async(req,res)=>{
 try {
   const { partyId } = req.body;

   if (!partyId || partyId.length === 0) {
     return res.status(400).json({ error: "No party IDs provided" });
   }

   // Delete products with matching IDs
   await Party.deleteMany({ _id: { $in: partyId } });

   res.status(200).json({ message: "parties deleted successfully!" });
 } catch (error) {
   res
     .status(500)
     .json({ error: "Failed to delete party", details: error.message });
 }
}