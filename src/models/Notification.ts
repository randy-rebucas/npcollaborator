import mongoose, { Schema, Types } from "mongoose";
import { IUser } from "./User";

export interface INotification {
  _id: string; // Add this line
  user: Types.ObjectId | IUser; 
  title: string;
  message: string;
  read: boolean;
  link?: string;
  type: string; // email, push, in-app
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  link: { type: String },
  type: { type: String, enum: ['email', 'push', 'in-app'], default: 'in-app' },
  createdAt: { type: Date, default: Date.now },
});

const Notification =
  mongoose.models.Notification ??
  mongoose.model<INotification>("Notification", notificationSchema);

export default Notification;
