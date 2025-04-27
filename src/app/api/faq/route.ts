import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Faq from "@/models/Faq";

export async function POST(request: Request) {
  const data = await request.json();
  try {
    await connect();
    const faq = await Faq.create(data);
    return NextResponse.json(faq);
  } catch (error) {
    console.error("Error in faq:", error);
    return NextResponse.json(
      { error: "Faq not found" },
      { status: 404 }
    );
  }
}