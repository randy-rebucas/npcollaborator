import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Faq from "@/models/Faq";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connect();
    const faq = await Faq.findById(id);
    return NextResponse.json(faq);
  } catch (error) {
    console.error("Error in faq:", error);
    return NextResponse.json(
      { error: "Faq not found" },
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
    const faq = await Faq.findByIdAndUpdate(id, data, {
      new: true,
    });
    return NextResponse.json(faq);
  } catch (error) {
    console.error("Error in faq:", error);
    return NextResponse.json(
      { error: "Faq not found" },
      { status: 404 }
    );
  }
}
