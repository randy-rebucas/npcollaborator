import { NextResponse } from "next/server";
import connect from "@/lib/db";
import {
  CollaborationRequest,
  CollaborationRequestStatus,
} from "@/models/Collaboration";
import Notification from "@/models/Notification"; 
import User, { UserSubmissionStatus } from "@/models/User";
import { logtoConfig } from "@/app/logto";
import { getLogtoContext } from "@logto/next/server-actions";
import Template from "@/models/Template";
import { EmailService } from "@/lib/email";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the Physician ID from params
    const { id } = await params;

    await connect();

    // check if the physician is approved
    const physician = await User.findById(id);
    if (
      !physician ||
      physician.submissionStatus !== UserSubmissionStatus.APPROVED
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Physician is not approved. Current submission status: " +
            physician.submissionStatus,
        },
        { status: 400 }
      );
    }

    // Check if the collaboration request already exists
    const collaborationRequest = await CollaborationRequest.findOne({
      physicianUser: id,
      npUser: claims?.id,
    });
    if (collaborationRequest) {
      return NextResponse.json(
        { success: false, message: "Collaboration request already exists" },
        { status: 400 }
      );
    }

    // Create a new collaboration request
    const newCollaborationRequest = new CollaborationRequest({
      npUser: claims?.id,
      physicianUser: id,
      status: CollaborationRequestStatus.PENDING,
      responseMessage: "Collaboration request received",
      respondedAt: new Date(),
    });
    const savedCollaborationRequest = await newCollaborationRequest.save();

    if (!savedCollaborationRequest) {
      return NextResponse.json(
        { success: false, message: "Failed to save collaboration request" },
        { status: 500 }
      );
    }

    const physicianUser = await User.findById(
      savedCollaborationRequest.physicianUser
    );
    if (!physicianUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create a notification for the NP
    await Notification.create({
      user: physicianUser.id,
      title: "Collaboration Request from NP",
      message: "NP has requested collaboration",
      link: `/np/collaborators/request`,
    });

    // Get the default template for collaboration request from NP
    let template = await Template.findOne({
      isDefault: true,
      type: "email",
      code: "collaboration-request-from-np",
    });
    if (!template) {
      template = await Template.findOne({
        type: "email",
        code: "collaboration-request-from-np",
      });
    }

    // Send email to NP
    const emailService = new EmailService();
    await emailService.sendEmail({
      to: [{ email: physicianUser.email }],
      subject: template?.name || "Collaboration Request from NP",
      htmlContent: template?.content || "<p>NP has requested collaboration</p>",
      sender: {
        name: process.env.NEXT_PUBLIC_APP_NAME || "npcollaborator",
        email:
          process.env.NEXT_PUBLIC_APP_EMAIL || "noreply@npcollaborator.com",
      },
    });

    return NextResponse.json({
      success: true,
      data: savedCollaborationRequest,
      message: "Collaboration request received successfully",
    });
  } catch (error) {
    console.error("Error requesting collaboration:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
