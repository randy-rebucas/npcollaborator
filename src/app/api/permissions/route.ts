import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Permission from "@/models/Permission";

export async function POST(request: Request) {
  const data = await request.json();
  try {
    await connect();
    const permission = await Permission.create(data);
    return NextResponse.json(permission);
  } catch (error) {
    console.error("Error in permission:", error);
    return NextResponse.json({ error: "Permission not found" }, { status: 404 });
  }
}

export async function GET() {
  try {
    await connect();
    const permissions = await Permission.find({});
    return NextResponse.json(permissions);
  } catch (error) {
    console.error("Error in permissions:", error);
    return NextResponse.json({ error: "Permissions not found" }, { status: 404 });
  }
}


