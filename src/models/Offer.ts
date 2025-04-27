import mongoose, { Schema, Types } from "mongoose";
import { IUser } from "@/models/User";
import { ICollaborationRequest } from "@/models/Collaboration";

export enum OfferStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
  WITHDRAWN = "WITHDRAWN",
}

export enum CompensationType {
  SALARY = "SALARY",
  HOURLY = "HOURLY",
}

export enum PositionType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
}

export enum BonusStructureType {
  PERCENTAGE = "PERCENTAGE",
  FIXED = "FIXED",
}

export enum NonCompeteClauseType {
  NON_COMPETE = "NON_COMPETE",
  NON_DISCLOSURE = "NON_DISCLOSURE",
}

export interface INonCompeteClause {
  duration: number;
  radius: number;
}

export interface IPosition {
  title: string;
  type: PositionType;
  schedule: {
    hoursPerWeek: number;
    shiftsPerWeek?: number;
    callRequirements?: string;
  };
  location: {
    facility: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface IBonusStructure {
  type: BonusStructureType;
  amount: number;
  conditions: string;
}

export interface IBenefits {
  healthInsurance: boolean;
  dentalInsurance: boolean;
  visionInsurance: boolean;
  retirement401k: boolean;
  paidTimeOff: number; // Number of days per year
  cmeAllowance?: number;
  malpracticeInsurance: boolean;
}

export interface IOffer {
  id: string;
  physicianUser: Types.ObjectId | IUser; // Reference to the physician making the offer
  nursePractitionerUser: Types.ObjectId | IUser; // Reference to the NP receiving the offer

  // Compensation details
  baseSalary: number;
  compensationType: CompensationType;
  bonusStructure?: IBonusStructure;
  benefits: IBenefits;

  // Position details
  position: IPosition;

  // Contract terms
  contractLength?: number; // in months
  startDate: Date;
  endDate: Date;
  probationaryPeriod?: number; // in months
  nonCompeteClause?: INonCompeteClause;

  // Offer status
  status: OfferStatus;
  offerDate: Date;
  expirationDate: Date;
  responseDate?: Date;

  // Additional details
  duties: string[];
  requirements: string[];
  additionalNotes?: string;

  // Collaboration details
  collaborationId: Types.ObjectId | ICollaborationRequest; 
}

const nonCompeteClauseSchema = new Schema<INonCompeteClause>(
  {
    duration: Number,
    radius: Number,
  },
  { _id: false }
);

const bonusStructureSchema = new Schema<IBonusStructure>(
  {
    type: String,
    amount: Number,
    conditions: String,
  },
  { _id: false }
);

const benefitsSchema = new Schema<IBenefits>(
  {
    healthInsurance: Boolean,
    dentalInsurance: Boolean,
    visionInsurance: Boolean,
    retirement401k: Boolean,
    paidTimeOff: Number,
  },
  { _id: false }
);

const positionSchema = new Schema<IPosition>(
  {
    title: String,
    type: String,
    schedule: Object,
    location: Object,
  },
  { _id: false }
);

const offerSchema = new mongoose.Schema<IOffer>({
  physicianUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  nursePractitionerUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  baseSalary: { type: Number, required: true },
  compensationType: {
    type: String,
    required: true,
    enum: Object.values(CompensationType),
  },
  bonusStructure: { type: bonusStructureSchema, required: false },
  benefits: { type: benefitsSchema, required: true },
  position: { type: positionSchema, required: true },
  contractLength: { type: Number, required: false },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  probationaryPeriod: { type: Number, required: false },
  nonCompeteClause: { type: nonCompeteClauseSchema, required: false },
  status: { type: String, required: true, enum: Object.values(OfferStatus) },
  offerDate: { type: Date, required: true },
  expirationDate: { type: Date, required: true },
  responseDate: { type: Date, required: false },
  duties: { type: [String], required: true },
  requirements: { type: [String], required: true },
  additionalNotes: { type: String, required: false },
  collaborationId: { type: Schema.Types.ObjectId, ref: "CollaborationRequest", required: true },
});

export default mongoose.models.Offer ||
  mongoose.model<IOffer>("Offer", offerSchema);
