import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    email: { type: String, required: true },
    bank: { type: String, required: false },
    contactPerson: { type: String, required: false },
    landline: { type: String, required: false },
    account: { type: String, required: false },
    ifsc: { type: String, required: false },
    role: { type: String, enum: ["Buyer", "Seller"], required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: false },
    city: { type: String, required: false },
    openingBalance: { type: String, required: false },
    state: { type: String, required: false },
    pan: { type: String, required: false },
    gst: { type: String, required: false },
    pin: { type: String, required: false },
  },
  { timestamps: true }
);

const Party = mongoose.model("Party", CompanySchema);
export default Party;
