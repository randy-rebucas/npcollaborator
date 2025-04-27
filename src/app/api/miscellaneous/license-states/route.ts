import { NextResponse } from "next/server";
import connect from "@/lib/db";
import MedicalLicenseState from "@/models/MedicalLicenseState";

export async function GET() {
  try {
    await connect();
    const licenseStates = await MedicalLicenseState.find({
      enabled: true,
    });
    return NextResponse.json(licenseStates);
  } catch (error) {
    console.error("Error in license state:", error);
    return NextResponse.json(
      { error: "License state not found" },
      { status: 404 }
    );
  }
}

export async function POST(request: Request) {
  const data = await request.json();
  try {
    await connect();
    const licenseState = await MedicalLicenseState.create(data);
    return NextResponse.json(licenseState);
  } catch (error) {
    console.error("Error in license state:", error);
    return NextResponse.json(
      { error: "License state not found" },
      { status: 404 }
    );
  }
}
