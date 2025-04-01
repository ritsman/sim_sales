import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
  locationName: { type: String, required: true },
  location: { type: String, required: true },
});

const PartySchema = new mongoose.Schema({
  partyId: { type: String, required: true, unique: true },
  partyName: { type: String, required: true },
  locations: [LocationSchema],
});

export const Location = mongoose.model("Location", PartySchema);
