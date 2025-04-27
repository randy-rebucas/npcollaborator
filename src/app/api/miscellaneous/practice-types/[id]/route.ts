import { NextResponse } from "next/server";
import connect from "@/lib/db";
import PracticeType from "@/models/PracticeType";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connect();
    const practiceType = await PracticeType.findById(id);
    return NextResponse.json(practiceType);
  } catch (error) {
    console.error("Error in practice type:", error);
    return NextResponse.json(
      { error: "Practice type not found" },
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
    console.log(data);
    const practiceType = await PracticeType.findByIdAndUpdate(id, data, {
      new: true,
    });
    return NextResponse.json(practiceType);
  } catch (error) {
    console.error("Error in practice type:", error);
    return NextResponse.json(
      { error: "Practice type not found" },
      { status: 404 }
    );
  }
}

