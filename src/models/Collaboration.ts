import mongoose, { Schema, Types } from "mongoose";
import { IUser } from "./User";

export enum CollaborationRequestStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  DECLINED = "declined",
  CANCELLED = "cancelled",
  WITHDRAWN = "withdrawn",
  OFFERED = "offered",
}

export enum ActiveCollaborationStatus {
  ACTIVE = "active",
  PAUSED = "paused",
  TERMINATED = "terminated",
}

export interface IActiveCollaboration {
  _id: string;
  npUser: Types.ObjectId | IUser;
  physicianUser: Types.ObjectId | IUser;
  startDate: Date;
  status: ActiveCollaborationStatus;
  agreementSignedAt: Date;
  lastAttestationDate: Date;
  nextAttestationDue: Date;
  monthlyRate: number;
}

export interface ICollaborationRequest {
  _id: string;
  npUser: Types.ObjectId | IUser;
  physicianUser: Types.ObjectId | IUser;
  status: CollaborationRequestStatus;
  requestedAt: Date;
  message: string;
  responseMessage: string;
  respondedAt: Date;
}

const collaborationRequestSchema = new mongoose.Schema({
  npUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  physicianUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: Object.values(CollaborationRequestStatus),
    default: CollaborationRequestStatus.PENDING,
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
  message: String,
  responseMessage: String,
  respondedAt: Date,
});

const activeCollaborationSchema = new mongoose.Schema({
  npUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  physicianUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  startDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(ActiveCollaborationStatus),
    default: ActiveCollaborationStatus.ACTIVE,
  },
  agreementSignedAt: Date,
  lastAttestationDate: Date,
  nextAttestationDue: Date,
});

export const CollaborationRequest =
  mongoose.models.CollaborationRequest ||
  mongoose.model<ICollaborationRequest>(
    "CollaborationRequest",
    collaborationRequestSchema
  );

export const ActiveCollaboration =
  mongoose.models.ActiveCollaboration ||
  mongoose.model<IActiveCollaboration>(
    "ActiveCollaboration",
    activeCollaborationSchema
  );
