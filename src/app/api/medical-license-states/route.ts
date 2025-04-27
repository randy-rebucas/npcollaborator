import { getMedicalLicenseStates } from "@/app/actions/medicallicensestates";
import { NextResponse } from "next/server";

export async function GET() {
    const medicalLicenseStates = await getMedicalLicenseStates();
    return NextResponse.json(medicalLicenseStates);
}

