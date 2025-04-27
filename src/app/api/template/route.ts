import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Template from "@/models/Template";

export async function POST(request: Request) {
  const data = await request.json();
  try {
    await connect();
    const slug = data.name.toLowerCase().replace(/ /g, "-");
    const template = await Template.create({ ...data, slug });
    return NextResponse.json(template);
  } catch (error) {
    console.error("Error in template:", error);
    return NextResponse.json(
      { error: "Template not found" },
      { status: 404 }
    );
  }
}