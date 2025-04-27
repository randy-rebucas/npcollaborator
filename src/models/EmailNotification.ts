import mongoose, { Schema } from "mongoose";

export interface IEmailNotification {
  _id: string; // Add this line
  title: string;
  message: string;
  link?: string;
  autoSend?: boolean;
  createdAt: Date;
}

const emailNotificationSchema = new Schema<IEmailNotification>({
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: { type: String },
  autoSend: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const EmailNotification =
  mongoose.models.EmailNotification ??
  mongoose.model<IEmailNotification>("EmailNotification", emailNotificationSchema);

export default EmailNotification;
