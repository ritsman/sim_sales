import { Activity } from "../../model/Master/Activity.model.js";

export const addActivity = async(req,res)=>{
  try {
    const newActivity = new Activity(req.body);
    await newActivity.save();
    res.status(201).json({ message: "Activity added successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add activity" });
  }
}

export const getActivity = async(req,res)=>{
  try {
    const activities = await Activity.find();
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch activities" });
  }
}

export const updateActivity = async(req,res)=>{
  try {
    const { id } = req.params;
    const updatedActivity = await Activity.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedActivity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res
      .status(200)
      .json({ message: "Activity updated successfully!", updatedActivity });
  } catch (error) {
    res.status(500).json({ error: "Failed to update activity" });
  }
}

export const deleteActivity = async(req,res)=>{
  try {
    const { id } = req.params;
    const deletedActivity = await Activity.findByIdAndDelete(id);

    if (!deletedActivity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.status(200).json({ message: "Activity deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete activity" });
  }
}