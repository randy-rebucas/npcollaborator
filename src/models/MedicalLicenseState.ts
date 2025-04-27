import mongoose, { Schema } from "mongoose";

export interface IMedicalLicenseState {
  _id: string;
  state: string;
  enabled: boolean;
}

const medicalLicenseStateSchema = new Schema<IMedicalLicenseState>(
  {
    state: { type: String, required: true },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const MedicalLicenseState =
  mongoose.models.MedicalLicenseState ??
  mongoose.model<IMedicalLicenseState>("MedicalLicenseState", medicalLicenseStateSchema);

export default MedicalLicenseState;