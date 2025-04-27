import {
    CollaborationRequest,
    ActiveCollaboration,
    ActiveCollaborationStatus,
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

      // Check if the collaboration request exists
      const collaborationRequest = await CollaborationRequest.findById(id);
      if (!collaborationRequest) {
        return NextResponse.json(
          { error: "Collaboration request not found" },
          { status: 404 }
        );
      }

      // Withdraw the offer
      const offer = await Offer.findOneAndUpdate({ collaborationId: id }, { status: OfferStatus.ACCEPTED }); 
      if (!offer) {
        return NextResponse.json(
          { error: "Offer not found" },
          { status: 404 }
        );
      }
      
      // Create an active collaboration
      const activeCollaboration = await ActiveCollaboration.create({ 
        npUser: collaborationRequest.npUser,
        physicianUser: collaborationRequest.physicianUser,
        startDate: new Date(),
        status: ActiveCollaborationStatus.ACTIVE,
        agreementSignedAt: new Date(),
        lastAttestationDate: new Date(),
        nextAttestationDue: new Date(),
      });

      // Delete the collaboration request
      await collaborationRequest.deleteOne();
  
      if (!activeCollaboration) {
        return NextResponse.json(
          { error: "Failed to create active collaboration" },
          { status: 500 }
        );
      }

      const npUser = await User.findById(activeCollaboration.npUser);
      if (!npUser) {
        return NextResponse.json(
          { error: "NP user not found" },
          { status: 404 }
        );
      }

      // Create a notification for the NP
      await Notification.create({
        user: npUser.id,
        title: "Offer Accepted",
        message: "Your offer has been accepted",
        link: `/collaborators/${id}`
      });

      // Get the default template for offer accepted
      let template = await Template.findOne({ isDefault: true, type: "email", code: "offer-accepted" });
      if (!template) {
        template = await Template.findOne({ type: "email", code: "offer-accepted" });
      }      

      // // Send email to NP
      // const emailService = new EmailService(); 
      // await emailService.sendEmail({
      //   to: { email: npUser.email },
      //   subject: template?.name || "Offer Accepted",
      //   htmlContent: template?.content || "<p>Your offer has been accepted</p>",
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
          activeCollaboration: {
            id: activeCollaboration._id,
            npUser: activeCollaboration.npUser,
            physicianUser: activeCollaboration.physicianUser,
            status: activeCollaboration.status,
            startDate: activeCollaboration.startDate
          }
        },
        message: "Offer accepted successfully"
      });
    } catch (error) {
      console.error("Error accepting offer:", error);
      return NextResponse.json(
        { error: "Failed to accept offer"},
        { status: 500 }
      );
    }
  }
  