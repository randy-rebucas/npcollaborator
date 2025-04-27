import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Role from "@/models/Role";

export async function POST(request: Request) {
  const data = await request.json();
  try {
    await connect();
    const role = await Role.create({
        ...data,
        slug: data.name.toLowerCase().replace(/ /g, "-"),
    });
    return NextResponse.json(role);
  } catch (error) {
    console.error("Error in role:", error);
    return NextResponse.json({ error: "Role not found" }, { status: 404 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const search = searchParams.get("search") || "";

  try {
    await connect();
    const roles = await Role.find({ name: { $regex: search, $options: "i" } })
      .skip((page - 1) * limit)
      .limit(limit);
    return NextResponse.json(roles);
  } catch (error) {
    console.error("Error in roles:", error);
    return NextResponse.json({ error: "Roles not found" }, { status: 404 });
  }
}



