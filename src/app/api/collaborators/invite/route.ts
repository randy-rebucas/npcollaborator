import { NextResponse } from "next/server";
import connect from "@/lib/db";
import { CollaborationRequest } from "@/models/Collaboration";
import User, { UserRole, UserSubmissionStatus } from "@/models/User";
import Notification from "@/models/Notification";
// import { EmailService } from "@/lib/email";
import Template from "@/models/Template";
import { logtoConfig } from "@/app/logto";
import { getLogtoContext } from "@logto/next/server-actions";

export async function POST(request: Request) {
  try {
    await connect();
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" }, 
        { status: 401 }
      );
    }
    const { email } = await request.json();

    const npUser = await User.findOne({ email: email });

    if (!npUser) {
      return NextResponse.json(
        { success: false, message: "User not found" }, 
        { status: 404 }
      );
    }

    if (npUser.role !== UserRole.NURSE_PRACTITIONER) {
      return NextResponse.json(
        { success: false, message: "User is not a NP" }, 
        { status: 400 }
      );
    }

    if (npUser.submissionStatus !== UserSubmissionStatus.APPROVED) {  
      return NextResponse.json(
        { success: false, message: "User is not approved" }, 
        { status: 400 }
      );
    }

    // Check for existing collaboration request
    const existingRequest = await CollaborationRequest.findOne({
      npUser: npUser.id,
      physicianUser: claims?.id,
      status: 'pending'
    });

    if (existingRequest) {
      return NextResponse.json(
        { success: false, message: "A pending collaboration request already exists" },
        { status: 400 }
      );
    }

    const collaborationRequest = new CollaborationRequest({
        npUser: npUser.id,
        physicianUser: claims?.id,
        status: 'pending', 
        requestedAt: new Date(),
        message: 'Collaboration invitation received',
    });
    await collaborationRequest.save();

    // Create a notification for the NP
    await Notification.create({
      user: npUser.id,
      title: "New Collaboration Invitation",
      message: `You have received a collaboration invitation from Dr. ${claims?.email}`,
      link: `/collaborators/request`,
    });

    // Get the default template for collaboration invitation
    let template = await Template.findOne({ isDefault: true, type: "email", code: "collaboration-invitation" });
    if (!template) {
      template = await Template.findOne({ type: "email", code: "collaboration-invitation" });
    }

    // Send email to NP
    // const emailService = new EmailService();
    // await emailService.sendEmail({
    //   to: [{ email: npUser.email }],
    //   subject: template?.name || "New Collaboration Invitation",
    //   htmlContent: template?.content || `<p>You have received a collaboration invitation from Physician. Please log in to your account to review and respond to this request.</p>`,
    //   sender: {
    //     name: process.env.NEXT_PUBLIC_APP_NAME || "npcollaborator",
    //     email: process.env.NEXT_PUBLIC_APP_EMAIL || "noreply@npcollaborator.com",
    //   },
    // });

    return NextResponse.json({ success: true, message: "Invitation sent successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
