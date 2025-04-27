import StripeAccount from "@/models/StripeAccount";
import { stripe } from "@/utils/stripe";
import { NextResponse } from "next/server";
import connect from "@/lib/db";
import { logtoConfig } from "@/app/logto";
import { getLogtoContext } from "@logto/next/server-actions";

export async function GET() {
  try {
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = claims?.id;

    await connect();

    const user = await StripeAccount.findOne({ user: userId });

    if (!user?.stripeAccountId) {
      return NextResponse.json({ account: null });
    }

    const balance = await stripe.balance.retrieve({
      stripeAccount: user.stripeAccountId,
    });

    return NextResponse.json({
      pending: balance.pending,
    });
  } catch (error) {
    console.error("Error fetching Stripe earnings:", error);
    return NextResponse.json(
      { error: "Failed to fetch Stripe earnings" },
      { status: 500 }
    );
  }
}
