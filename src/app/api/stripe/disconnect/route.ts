import { NextResponse } from "next/server";
import StripeAccount from "@/models/StripeAccount";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";
import connect from "@/lib/db";
import { stripe } from "@/utils/stripe";

export async function POST() {
  try {
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = claims?.id;

    await connect();

    const user = await StripeAccount.findOne({ user: userId });

    if (user?.stripeAccountId) {
      // Deauthorize the account with Stripe
      await stripe.accounts.del(user.stripeAccountId);

      // Remove Stripe account ID from database
      await StripeAccount.findOneAndUpdate(
        { user: userId },
        { $unset: { stripeAccountId: "" } },
        { new: true }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error disconnecting Stripe:", error);
    return NextResponse.json(
      { error: "Failed to disconnect Stripe account" },
      { status: 500 }
    );
  }
}
