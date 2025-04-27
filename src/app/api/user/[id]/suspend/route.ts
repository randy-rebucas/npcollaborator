import { NextResponse } from "next/server";
import { updateUserSuspensionStatus } from "@/app/actions/user";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const {isSuspended} = await request.json();
    const user = await updateUserSuspensionStatus(id, isSuspended);
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
