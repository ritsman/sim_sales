import { Profile } from "../../model/Profile/Profile.model.js"

export const createProfile = async(req,res)=>{
  try {
    let profile = await Profile.findOne();
    if (profile) {
      profile = await Profile.findByIdAndUpdate(profile._id, req.body, {
        new: true,
      });
    } else {
      profile = new Profile(req.body);
      await profile.save();
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Error saving profile", error });
  }
}

export const updateProfile = async(req,res)=>{
  try {
    const profile = await Profile.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
}

export const getProfile = async(req,res)=>{
 try {
   const profile = await Profile.findOne();
//    if (!profile) {
//      return res.status(404).json({ message: "No profile found" });
//    }
   res.json(profile);
 } catch (error) {
   res.status(500).json({ message: "Server error", error });
 }
}

export const deleteProfile = async(req,res)=>{
  try {
    await Profile.findByIdAndDelete(req.params.id);
    res.json({ message: "Profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting profile", error });
  }
}