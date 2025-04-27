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
          { error: "Collaboration request not found" },
          { status: 404 }
        );
      }

      // Withdraw the offer
      const offer = await Offer.findOneAndUpdate({ collaborationId: id }, { status: OfferStatus.WITHDRAWN });
      if (!offer) {
        return NextResponse.json(
          { error: "Offer not found" },
          { status: 404 }
        );
      }
  
      collaborationRequest.status = CollaborationRequestStatus.WITHDRAWN;
      collaborationRequest.responseMessage = "Offer withdrawn";
      collaborationRequest.respondedAt = new Date();
      const savedCollaborationRequest = await collaborationRequest.save();
  
      if (savedCollaborationRequest) {
        const npUser = await User.findById(savedCollaborationRequest.npUser); 
        // Create a notification for the NP
        await Notification.create({
          user: npUser.id,
          title: "Offer Withdrawn",
          message: "Your offer has been withdrawn",
          link: `/collaborators/${id}`
        });

        // Get the default template for offer withdrawn
        let template = await Template.findOne({ isDefault: true, type: "email", code: "offer-withdrawn" });
        if (!template) {
          template = await Template.findOne({ type: "email", code: "offer-withdrawn" });
        }

        // // Send email to NP
        // const emailService = new EmailService();
        // await emailService.sendEmail({
        //   to: { email: npUser.email },
        //   subject: template?.name || "Offer Withdrawn",
        //   htmlContent: template?.content || "<p>Your offer has been withdrawn</p>",
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
          data: {
            collaborationRequest: savedCollaborationRequest,
            offer: offer,
            message: "Offer successfully withdrawn"
          }
        });
      }

      return NextResponse.json(
        { error: "Failed to save collaboration request" },
        { status: 500 }
      );
    } catch (error) {
      console.error("Error withdrawing offer:", error);
      return NextResponse.json(
        { error: "Failed to withdraw offer" },
        { status: 500 }
      );
    }
  }
  