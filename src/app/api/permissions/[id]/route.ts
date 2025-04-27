import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Permission from "@/models/Permission";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connect();
    const permission = await Permission.findById(id); 
    return NextResponse.json(permission);
  } catch (error) {
    console.error("Error in permission:", error);
    return NextResponse.json(
      { error: "Permission not found" },
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
    const permission = await Permission.findByIdAndUpdate(id, { ...data }, {
      new: true,
    });
    return NextResponse.json(permission);
  } catch (error) {
    console.error("Error in permission:", error);
    return NextResponse.json(
      { error: "Permission not found" },
      { status: 404 }
    );
  }
}
