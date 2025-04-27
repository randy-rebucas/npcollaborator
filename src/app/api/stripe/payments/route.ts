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

    const paymentIntents = await stripe.paymentIntents.list(
      {
        limit: 100,
      },
      {
        stripeAccount: user.stripeAccountId,
      }
    );

    const payments = paymentIntents.data.map((payment) => ({
      id: payment.id,
      amount: payment.amount,
      status: payment.status,
      created: payment.created,
      customer: payment.customer as string,
    }));

    return NextResponse.json({ payments });
  } catch (error) {
    console.error("Error fetching Stripe payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
