import mongoose from "mongoose";

export interface IEnquiry {
  id: string;
  email: string;
  subject: string;
  message: string;
  status: "pending" | "resolved" | "closed";
  createdAt: Date;
}

const enquirySchema = new mongoose.Schema<IEnquiry>({
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const Enquiry = 
  mongoose.models.Enquiry ??
  mongoose.model<IEnquiry>("Enquiry", enquirySchema);

export default Enquiry;