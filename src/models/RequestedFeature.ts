import mongoose from "mongoose";

export interface IRequestedFeature {
  id: string;
  email: string;
  title: string;
  description: string;
  status: "pending" | "resolved" | "closed" | "in_progress";
  createdAt: Date;
}

const requestedFeatureSchema = new mongoose.Schema<IRequestedFeature>({
  email: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const RequestedFeature =
  mongoose.models.RequestedFeature ??
  mongoose.model<IRequestedFeature>("RequestedFeature", requestedFeatureSchema);

export default RequestedFeature;
