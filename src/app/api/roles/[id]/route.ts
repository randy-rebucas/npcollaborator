import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Role from "@/models/Role";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connect();
    const role = await Role.findById(id); 
    return NextResponse.json(role);
  } catch (error) {
    console.error("Error in role:", error);
    return NextResponse.json(
      { error: "Role not found" },
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
    const role = await Role.findByIdAndUpdate(id, { ...data }, {
      new: true,
    });
    return NextResponse.json(role);
  } catch (error) {
    console.error("Error in role:", error);
    return NextResponse.json(
      { error: "Role not found" },
      { status: 404 }
    );
  }
}
