import { NextResponse } from "next/server";
import {
  CollaborationRequest,
  CollaborationRequestStatus,
} from "@/models/Collaboration";
import connect from "@/lib/db";
import User from "@/models/User";
import Notification from "@/models/Notification";
// import { EmailService } from "@/lib/email";
import Template from "@/models/Template";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await connect();
    const collaborationRequest = await CollaborationRequest.findById(id);
    if (!collaborationRequest) {
      return NextResponse.json(
        { error: "Collaboration request not found" },
        { status: 404 }
      );
    }

    collaborationRequest.status = CollaborationRequestStatus.ACCEPTED;
    collaborationRequest.responseMessage = "Collaboration request accepted";
    collaborationRequest.respondedAt = new Date();
    const savedCollaborationRequest = await collaborationRequest.save();

    if (!savedCollaborationRequest) {
      return NextResponse.json(
        { error: "Failed to save collaboration request" },
        { status: 500 }
      );
    }

    const npUser = await User.findById(savedCollaborationRequest.npUser);
    if (!npUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create a notification for the NP
    await Notification.create({
      user: npUser.id,
      title: "Collaboration Request Accepted",
      message: "Your collaboration request has been accepted",
      link: `/collaborators/${id}`,
    }); 

    // Get the default template for collaboration request accepted
    let template = await Template.findOne({ isDefault: true, type: "email", code: "collaboration-request-accepted" });
    if (!template) {
      template = await Template.findOne({ type: "email", code: "collaboration-request-accepted" });
    }

    // // Send email to NP
    // const emailService = new EmailService();
    // await emailService.sendEmail({
    //   to: { email: npUser.email },
    //   subject: template?.name || "Collaboration Request Accepted",
    //   htmlContent: template?.content || "<p>Your collaboration request has been accepted</p>",
    //   sender: {
    //     name: process.env.NEXT_PUBLIC_APP_NAME || "npcollaborator",
    //     email: process.env.NEXT_PUBLIC_APP_EMAIL || "noreply@npcollaborator.com",
    //   },
    //   replyTo: {
    //     name: process.env.NEXT_PUBLIC_APP_NAME || "npcollaborator",
    //     email: process.env.NEXT_PUBLIC_APP_EMAIL || "noreply@npcollaborator.com",
    //   },
    // });

    return NextResponse.json({
      success: true,
      data: savedCollaborationRequest,
      message: "Collaboration request accepted successfully",
    });
  } catch (error) {
    console.error("Error accepting offer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
