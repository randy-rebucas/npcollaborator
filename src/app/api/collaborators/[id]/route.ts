import { NextResponse } from "next/server";
import { CollaborationRequest } from "@/models/Collaboration";
import connect from "@/lib/db";
import User from "@/models/User";
import Notification from "@/models/Notification";
// import { EmailService } from "@/lib/email";
import Template from "@/models/Template";
export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    await connect();
    const collaborator = await CollaborationRequest.findByIdAndDelete(id);
    
    if (!collaborator) {
      return NextResponse.json(
        { error: "Collaborator not found" },
        { status: 404 }
      );
    }

    // Create a notification for the NP
    const npUser = await User.findById(collaborator.npUser);
    
    if (!npUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    await Notification.create({
      user: npUser.id,
      title: "Collaboration Request Removed",
      message: "Your collaboration request has been removed",
      link: `/collaborators/request`,
    });

    // Get the default template for collaboration request removed
    let template = await Template.findOne({ isDefault: true, type: "email", code: "collaboration-request-removed" });
    if (!template) {
      template = await Template.findOne({ type: "email", code: "collaboration-request-removed" });
    }
    // // Send email to NP
    // const emailService = new EmailService();
    // await emailService.sendEmail({
    //   to: { email: npUser.email },
    //   subject: template?.name || "Collaboration Request Removed",
    //   htmlContent: template?.content || "<p>Your collaboration request has been removed</p>",
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
      message: "Collaborator removed successfully" 
    });
    
  } catch (error) {
    console.error("Error removing collaborator:", error);
    return NextResponse.json(
      { error: "Failed to remove collaborator" },
      { status: 500 }
    );
  }
};
