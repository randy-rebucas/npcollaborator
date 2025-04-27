import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Template from "@/models/Template";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connect();
    const template = await Template.findById(id);
    return NextResponse.json(template);
  } catch (error) {
    console.error("Error in template:", error);
    return NextResponse.json(
      { error: "Template not found" },
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
    const slug = data.name.toLowerCase().replace(/ /g, "-");
    const template = await Template.findByIdAndUpdate(id, { ...data, slug }, {
      new: true,
    });
    return NextResponse.json(template);
  } catch (error) {
    console.error("Error in template:", error);
    return NextResponse.json(
      { error: "Template not found" },
      { status: 404 }
    );
  }
}
