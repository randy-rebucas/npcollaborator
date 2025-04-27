import mongoose, { Schema } from "mongoose";

export interface IRole {
  id: string;
  name: string;
  slug: string;
  description: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true }, // slug is the name of the role in lowercase and without spaces
    description: { type: String, required: true },
    permissions: { type: [String], required: true },
  },
  { timestamps: true }
);

const Role =
  mongoose.models.Role ??
  mongoose.model<IRole>("Role", roleSchema);

export default Role;
