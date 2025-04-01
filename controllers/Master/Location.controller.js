import { Location } from "../../model/Master/Location.model.js"
export const createLocation = async(req,res)=>{
  try {
    const { party, locations } = req.body;
    let existingParty = await Location.findOne({ partyId: party.partyId });

    if (existingParty) {
      existingParty.locations.push(...locations);
      await existingParty.save();
      return res.status(200).json(existingParty);
    }

    const newParty = new Location({
      partyId: party.partyId,
      partyName: party.partyName,
      locations,
    });
    await newParty.save();
    res.status(201).json(newParty);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

export const getLocation = async(req,res)=>{
  try {
    const parties = await Location.find();
    res.json(parties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const updateLocation = async(req,res)=>{
  try {
    const updatedParty = await Location.findOneAndUpdate(
      { partyId: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!updatedParty)
      return res.status(404).json({ message: "Party not found" });
    res.json(updatedParty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const deleteLocation = async(req,res)=>{
  try {
    const deletedParty = await Location.findOneAndDelete({
      partyId: req.params.id,
    });
    if (!deletedParty)
      return res.status(404).json({ message: "Party not found" });
    res.json({ message: "Party deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}