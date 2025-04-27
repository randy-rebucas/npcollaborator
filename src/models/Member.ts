import mongoose, { Schema } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export interface IMember {
  event: string;
  payload: object;
  reason: Array<string>;
  timestamp: Date;
  accountSynced: boolean;
  createdAt: Date;
  updatedAt: Date;
  id?: string;
}

// 2. Create an Schema corresponding to the document interface.
const memberSchema = new Schema<IMember>({
  event: {type: String, required: true},
  payload: {type: Object, required: true},
  reason: [{type: String}],
  timestamp: {type: Date, default: Date.now},
  accountSynced: {type: Boolean, default: false},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
});

// 3. Create a Model.
const Member =
  mongoose.models.Members ??
  mongoose.model<IMember>("Members", memberSchema);

export default Member;


