import { NextResponse } from "next/server";
import connect from "@/lib/db";
import MedicalLicenseState from "@/models/MedicalLicenseState";

export async function GET() {
  try {
    connect();
    const medicalLicenseStates = await MedicalLicenseState.find({}).exec();
    const transformedMedicalLicenseStates = medicalLicenseStates.map(
      (state) => state.state
    );
    return NextResponse.json(transformedMedicalLicenseStates);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch states ${error}` },
      { status: 500 }
    );
  }
}
