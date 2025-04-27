import { NextResponse } from "next/server";
import { CollaborationRequest } from "@/models/Collaboration";
import connect from "@/lib/db";
import { logtoConfig } from "@/app/logto";
import { getLogtoContext } from "@logto/next/server-actions";

export async function GET() {
  try {
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const collaborationRequests = await CollaborationRequest.find({
      physicianUser: claims?.id,
    //   status: 'pending',
    }).populate({
      path: "npUser",
      model: "User",
      select: "-password",
    });

    const collaborationRequestsArray = collaborationRequests.map((request) => ({
      id: request._id,
      name: request.npUser.username,
      email: request.npUser.email,
      status: request.status,
      avatarUrl: null,
    }));
    
    return NextResponse.json(collaborationRequestsArray);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
