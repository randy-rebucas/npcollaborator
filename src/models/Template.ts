import mongoose, { Schema } from "mongoose";

export interface ITemplate {
  id: string;
  name: string;
  slug: string;
  code: string;
  content: string;
  type: "email" | "sms";
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const templateSchema = new Schema<ITemplate>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    code: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, required: true, enum: ["email", "sms"], default: "email" },
    isDefault: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Template =
  mongoose.models.Template ??
  mongoose.model<ITemplate>("Template", templateSchema);

export default Template;
