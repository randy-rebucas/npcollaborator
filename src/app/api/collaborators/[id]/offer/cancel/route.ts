import {
  CollaborationRequest,
  CollaborationRequestStatus,
} from "@/models/Collaboration";
import Offer, { OfferStatus } from "@/models/Offer";
import User from "@/models/User";
import Notification from "@/models/Notification";
// import { EmailService } from "@/lib/email";

import { NextResponse } from "next/server";
import Template from "@/models/Template";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collaborationRequest = await CollaborationRequest.findById(id);
    if (!collaborationRequest) {
      return NextResponse.json(
        { success: false, error: "Collaboration request not found" },
        { status: 404 }
      );
    }

    const offer = await Offer.findOneAndUpdate(
      { collaborationId: id },
      { status: OfferStatus.CANCELLED }
    );
    if (!offer) {
      return NextResponse.json(
        { success: false, error: "Offer not found" },
        { status: 404 }
      );
    }

    // Cancel the offer
    collaborationRequest.status = CollaborationRequestStatus.CANCELLED;
    collaborationRequest.responseMessage = "Offer cancelled";
    collaborationRequest.respondedAt = new Date();
    const savedCollaborationRequest = await collaborationRequest.save();

    if (!savedCollaborationRequest) {
      return NextResponse.json(
        { success: false, error: "Failed to save collaboration request" },
        { status: 500 }
      );
    }

    const npUser = await User.findById(savedCollaborationRequest.npUser);
    if (!npUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Create a notification for the NP
    await Notification.create({
      user: npUser.id,
      title: "Offer Cancelled",
      message: "Your offer has been cancelled",
      link: `/collaborators/${id}`,
    });

    // Get the default template for offer cancelled
    let template = await Template.findOne({ isDefault: true, type: "email", code: "offer-cancelled" });
    if (!template) {
      template = await Template.findOne({ type: "email", code: "offer-cancelled" });
    }

    // // Send email to NP
    // const emailService = new EmailService();
    // await emailService.sendEmail({
    //   to: { email: npUser.email },
    //   subject: template?.name || "Offer Cancelled",
    //   htmlContent: template?.content || "<p>Your offer has been cancelled</p>",
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
      message: "Offer cancelled successfully",
      data: savedCollaborationRequest,
    });
  } catch (error) {
    console.error("Error cancelling offer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to cancel offer" },
      { status: 500 }
    );
  }
}
