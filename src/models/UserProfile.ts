import mongoose, { Schema, Types } from "mongoose";
import { IUser } from "./User";
import { Certification, Education, License } from "@/types/onboarding";

export interface IUserProfile {
  user: Types.ObjectId | IUser;
  
  // Step 1: User Information
  firstName: string;
  lastName: string;

  // Step 2: License Information
  medicalLicenseStates: License[];
  deaLicenseStates: License[];

  // Step 3: Clinical Practice Types
  practiceTypes: string[];

  // Step 4: Rate Matrix
  monthlyCollaborationRate: number;
  additionalStateFee: number;
  additionalNPFee: number;
  controlledSubstancesMonthlyFee: number;

  // Step 5: Background & Certifications
  title?: string;
  description: string;
  publications?: string;
  boardCertification: string;
  additionalCertifications: Certification[];
  linkedinProfile: string;

  // Step 6: Profile Photo
  profilePhotoPath: string;
  governmentIdPath: string;

  npiNumber?: string;
  clinicalDegree?: string;
  education?: Education;

  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;

  startDate?: Date;
  controlledSubstances?: boolean;
}

const licenseSchema = new Schema<License>(
  {
    state: String,
    licenseNumber: String,
    expirationDate: { type: Date, default: null },
  },
  { _id: false }
);

const certificationSchema = new Schema<Certification>(
  {
    certification: String,
    issueDate: { type: Date, default: null },
    expirationDate: { type: Date, default: null },
    certificateUrl: String,
    certificateNumber: String,
  },
  { _id: false }
);

const educationSchema = new Schema<Education>(
  {
    undergrad: String,
    medical: String,
    residency: String,
  },
  { _id: false }
);

const userProfileSchema = new Schema<IUserProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },

    medicalLicenseStates: [licenseSchema],
    deaLicenseStates: [licenseSchema],

    practiceTypes: { type: [String], required: true },

    monthlyCollaborationRate: { type: Number, required: true },
    additionalStateFee: { type: Number, required: true },
    additionalNPFee: { type: Number, required: true },
    controlledSubstancesMonthlyFee: { type: Number, required: true },

    title: { type: String },
    description: { type: String, required: true },
    publications: { type: String },
    boardCertification: { type: String, required: true },
    additionalCertifications: [certificationSchema],
    linkedinProfile: { type: String, required: true },

    profilePhotoPath: { type: String },
    governmentIdPath: { type: String },

    npiNumber: { type: String },
    clinicalDegree: { type: String },
    education: educationSchema,
  },
  { timestamps: true }
);

const UserProfile =
  mongoose.models.UserProfile ??
  mongoose.model<IUserProfile>("UserProfile", userProfileSchema);

export default UserProfile;
