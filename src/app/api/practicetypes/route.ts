import { NextResponse } from "next/server";
import connect from "@/lib/db";
import PracticeType from "@/models/PracticeType";

export async function GET() {
  try {
    connect();
    const practices = await PracticeType.find({}).exec();
    const transformedPractices = practices
      .map((practice) => practice.type)
      .filter((type) => type !== undefined);
    return NextResponse.json(transformedPractices);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch practices ${error}` },
      { status: 500 }
    );
  }
}
