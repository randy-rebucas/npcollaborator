import mongoose, { Schema } from "mongoose";

export interface IPracticeType {
  _id: string;
  type: string;
  enabled: boolean;
}

const practiceTypeSchema = new Schema<IPracticeType>(
  {
    type: { type: String, required: true },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const PracticeType =
  mongoose.models.PracticeType ??
  mongoose.model<IPracticeType>("PracticeType", practiceTypeSchema);

export default PracticeType;