import mongoose, { Schema } from "mongoose";

export interface IPermission {
  id: string;
  name: string;
  description: string;
  resource: string;
  createdAt: Date;
  updatedAt: Date;
}

const permissionSchema = new Schema<IPermission>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    resource: { type: String, required: true }, // resource is the name of the resource in lowercase and without spaces
  },
  { timestamps: true }
);

const Permission = 
  mongoose.models.Permission ??
  mongoose.model<IPermission>("Permission", permissionSchema);

export default Permission;
