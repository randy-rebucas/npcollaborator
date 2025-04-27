import Stripe from 'stripe';
import StripeAccount from '@/models/StripeAccount';
import { stripe } from '@/utils/stripe';
import { NextResponse } from 'next/server';
import connect from '@/lib/db';
import { getLogtoContext } from '@logto/next/server-actions';
import { logtoConfig } from '@/app/logto';

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
            limit: 100,
            expand: ['data.destination'],
        }, {
            stripeAccount: user.stripeAccountId
        });

        const formattedPayouts = payouts.data.map(payout => ({
            id: payout.id,
            amount: payout.amount,
            status: payout.status,
            arrival_date: payout.arrival_date,
            description: payout.description,
            bank_account: typeof payout.destination === 'string' 
                ? payout.destination.slice(-4) 
                : `****${(payout.destination as Stripe.BankAccount)?.last4 || ''}`,
        }));

        return NextResponse.json({ payouts: formattedPayouts });
    } catch (error) {
        console.error('Error fetching Stripe payouts:', error);
        return NextResponse.json({ error: 'Failed to fetch payouts' }, { status: 500 });
    }
} 