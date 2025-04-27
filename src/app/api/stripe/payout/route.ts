import StripeAccount from "@/models/StripeAccount";
import { stripe } from "@/utils/stripe";
import { NextResponse } from "next/server";
import connect from "@/lib/db";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";

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

    const payouts = await stripe.payouts.list({
      stripeAccount: user.stripeAccountId,
    });
    console.log(payouts);
    return NextResponse.json({
      payouts: payouts,
    });
  } catch (error) {
    console.error("Error fetching Stripe payouts:", error);
    return NextResponse.json(
      { error: "Failed to fetch Stripe payouts" },
      { status: 500 }
    );
  }
}
