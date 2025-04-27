import { NextResponse } from "next/server";
import { CollaborationRequest } from "@/models/Collaboration";
import connect from "@/lib/db";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";

export async function GET() {
  try {
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const collaborationRequests = await CollaborationRequest.find({
      physicianUser: claims?.id,
    }).populate({
      path: "npUser",
      model: "User",
      select: "-password",
    });
 
    return NextResponse.json(collaborationRequests);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
