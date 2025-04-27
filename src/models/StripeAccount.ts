import mongoose, { Schema, Types } from "mongoose";
import { IUser } from "./User";

export interface IStripeAccount {
  _id: string; // Add this line
  user: Types.ObjectId | IUser; 
  stripeAccountId: string;
  createdAt: Date;
}

const stripeAccountSchema = new Schema<IStripeAccount>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  stripeAccountId: {
    type: String,
    unique: true,
    sparse: true
  },
}, { timestamps: true });

const StripeAccount =
  mongoose.models.StripeAccount ??
  mongoose.model<IStripeAccount>("StripeAccount", stripeAccountSchema);

export default StripeAccount;
