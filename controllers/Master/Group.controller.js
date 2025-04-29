import Group from "../../model/Master/Group.model.js";
export const createGroup = async(req,res) => {
 try {
   let existing = await Group.findOne({ name: req.body.name });

   if (!existing) {
     let result = new Group({
       name: req.body.name,
       type: req.body.type,
       subgroup: req.body.subgroup,
     });
     await result.save();
   } else {

     existing.type = req.body.type;
     existing.subgroup = req.body.subgroup;

     await existing.save(); // Save the changes to the existing document
   }
   res.send("Data sent successfully");
 } catch (error) {
   res.status(500).send(error); // Return appropriate error status
   console.log(error);
 }
}

export const updateGroup = async(req,res)=>{
 try {
   const updatedGroup = await Group.findByIdAndUpdate(req.params.id, req.body, {
     new: true,
   });
   if (!updatedGroup) {
     return res.status(404).json({ message: "Group not found" });
   }
   res.status(200).json(updatedGroup);
 } catch (error) {
   res.status(500).json({ error: error.message });
 }
}

export const getGroup = async(req,res)=>{
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const deleteGroup = async(req,res)=>{
 try {
   const deletedGroup = await Group.findByIdAndDelete(req.params.id);
   if (!deletedGroup) {
     return res.status(404).json({ message: "Group not found" });
   }
   res.status(200).json({ message: "Group deleted successfully" });
 } catch (error) {
   res.status(500).json({ error: error.message });
 }
}