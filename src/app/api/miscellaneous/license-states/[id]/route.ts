import { NextResponse } from "next/server";
import connect from "@/lib/db";
import MedicalLicenseState from "@/models/MedicalLicenseState";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connect();
    const licenseState = await MedicalLicenseState.findById(id);
    return NextResponse.json(licenseState);
  } catch (error) {
    console.error("Error in license state:", error);
    return NextResponse.json(
      { error: "License state not found" },
      { status: 404 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await connect();
    const data = await request.json();
    const licenseState = await MedicalLicenseState.findByIdAndUpdate(id, data, {
      new: true,
    });
    return NextResponse.json(licenseState);
  } catch (error) {
    console.error("Error in license state:", error);
    return NextResponse.json(
      { error: "License state not found" },
      { status: 404 }
    );
  }
}
