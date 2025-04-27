import { NextResponse } from "next/server";
import connect from "@/lib/db";
import PracticeType from "@/models/PracticeType";

export async function GET() {
  try {
    await connect();
    const practiceTypes = await PracticeType.find({
      enabled: true,
    });

    return NextResponse.json(practiceTypes);
  } catch (error) {
    console.error("Error in practice type:", error);
    return NextResponse.json(
      { error: "Practice type not found" },
      { status: 404 }
    );
  }
}

export async function POST(request: Request) {
  const data = await request.json();
  try {
    await connect();
    const practiceType = await PracticeType.create(data);
    return NextResponse.json(practiceType);
  } catch (error) {
    console.error("Error in practice type:", error);
    return NextResponse.json(
      { error: "Practice type not found" },
      { status: 404 }
    );
  }
}
