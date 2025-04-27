import { Certification } from "../types/onboarding";
import mongoose, { Schema } from "mongoose";

export type License = {
  state: string;
  licenseNumber: string;
  expirationDate: Date | null;
}

export enum UserRole {
  ADMIN = "ADMIN",
  PHYSICIAN = "PHYSICIAN",
  NURSE_PRACTITIONER = "NURSE_PRACTITIONER",
}

export enum UserOnBoardingStatus {
  COMPLETED = "COMPLETED",
  INCOMPLETE = "INCOMPLETE",
}

export enum UserSubmissionStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  INCOMPLETE = "INCOMPLETE",
  INCORRECT = "INCORRECT",
}

export interface IUserCustomData {
  role: string;
  onboardingStatus?: string;
  submissionStatus?: string;
  canCreateListings?: boolean;
  education?: {
    undergrad?: string;
    medical?: string;
    residency?: string;
  };
  profilePhotoPath?: string;
  governmentIdPath?: string;
  npiNumber?: string;
  clinicalDegree?: string;
  licenseAndCertification?: {
    medicalLicenseStates?: License[];
    deaLicenseStates?: License[];
  };
  practiceTypes?: string[];
  rateMatrix?: {
    monthlyCollaborationRate: number;
    additionalStateFee: number;
    additionalNPFee: number;
    controlledSubstancesMonthlyFee: number;
    controlledSubstancesPerPrescriptionFee: number;
  };
  backgroundCertification?: {
    description: string;
    boardCertification: string;
    additionalCertifications: Certification[];
    linkedinProfile: string;
  };
  description?: string;
  linkedinProfile?: string;
  accountSynced?: boolean;
  stripeAccountId?: string;
  controlledSubstances?: string | null;
}

export interface IUser {
  id?: string;
  username?: string;
  primaryEmail?: string;
  primaryPhone?: string;
  name?: string;
  avatar?: string | null;
  customData?: IUserCustomData;
  profile?: IUserProfile;
  identities?: object;
  lastSignInAt?: number;
  createdAt?: number;
  updatedAt?: number;
  applicationId?: string;
  isSuspended?: boolean;
  hasPassword?: boolean;
}

export interface IUserProfile {
  familyName: string;
  givenName: string;
  middleName?: string;
  nickname?: string;
  preferredUsername?: string;
  profile?: string;
  website?: string;
  gender?: string;
  birthdate?: string;
  zoneinfo?: string;
  locale?: string;
  address?: {
    formatted?: string;
    streetAddress?: string;
    locality?: string;
    region?: string;
    postalCode?: string;
    country?: string;
  };
}

const userSchema = new Schema<IUser>(
  {
    primaryEmail: { type: String, required: true, unique: true },
    primaryPhone: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    customData: { type: Object, required: true },
    identities: { type: Object, required: true },
    lastSignInAt: { type: Number, required: true },
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, required: true },
    profile: { type: Object, required: true },
    applicationId: { type: String, required: true },
    isSuspended: { type: Boolean, required: true },
    hasPassword: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const User = mongoose.models.User ?? mongoose.model<IUser>("User", userSchema);

export default User;
