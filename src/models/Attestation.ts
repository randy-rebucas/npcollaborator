import mongoose, { Schema, Types } from "mongoose";
import { IUser } from "./User";

export enum AttestationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export interface IAttestation {
  _id: string;
  schema: string;
  recipient: Types.ObjectId | IUser; 
  attester: Types.ObjectId | IUser; 
  timestamp: Date;
  status: AttestationStatus;
  createdAt: Date;
}

const attestationSchema = new Schema<IAttestation>({
  schema: { type: String, required: true },
  recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  attester: { type: Schema.Types.ObjectId, ref: "User", required: true },
  timestamp: { type: Date, required: true },
  status: { type: String, enum: AttestationStatus, required: true },
  createdAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
  collection: 'attestations'
});

attestationSchema.index({ recipient: 1 });
attestationSchema.index({ attester: 1 });
attestationSchema.index({ status: 1 });
attestationSchema.index({ createdAt: 1 });

const Attestation =
  mongoose.models.Attestation ??
  mongoose.model<IAttestation>("Attestation", attestationSchema);

export default Attestation;
