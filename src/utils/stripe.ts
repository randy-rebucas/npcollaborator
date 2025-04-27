import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Account
export interface IAccountObject {
  id: string;
  object: string;
  business_profile: {
    annual_revenue: null;
    estimated_worker_count: null;
    mcc: null;
    name: null;
    product_description: null;
    support_address: null;
    support_email: null;
    support_phone: null;
    support_url: null;
    url: null
  },
  business_type: null;
  capabilities: object;
  charges_enabled: boolean;
  controller: {
    fees: {
      payer: string;
    },
    is_controller: boolean;
    losses: {
      payments: string;
    },
    requirement_collection: string;
    stripe_dashboard: {
      type: string;
    },
    type: string;
  },
  country: string;
  created: number;
  default_currency: string;
  details_submitted: boolean;
  email: string;
  external_accounts: {
    object: string;
    data: [];
    has_more: boolean;
    total_count: number;
    url: string;
  },
  future_requirements: {
    alternatives: [];
    current_deadline: null;
    currently_due: [];
    disabled_reason: null;
    errors: [];
    eventually_due: [];
    past_due: [];
    pending_verification: []
  },
  login_links: {
    object: string;
    total_count: number;
    has_more: boolean;
    url: string;
    data: [];
  },
  metadata: object;
  payouts_enabled: boolean;
  requirements: {
    alternatives: [];
    current_deadline: null;
    currently_due: [];
    disabled_reason: string;
    errors: [];
    eventually_due: [];
    past_due: [];
    pending_verification: [];
  },
  settings: {
    bacs_debit_payments: {
      display_name: null;
      service_user_number: null;
    },
    branding: {
      icon: null;
      logo: null;
      primary_color: null;
      secondary_color: null;
    },
    card_issuing: {
      tos_acceptance: {
        date: null;
        ip: null;
      }
    },
    card_payments: {
      decline_on: {
        avs_failure: boolean;
        cvc_failure: boolean;
      },
      statement_descriptor_prefix: null;
      statement_descriptor_prefix_kanji: null;
      statement_descriptor_prefix_kana: null;
    },
    dashboard: {
      display_name: null;
      timezone: string;
    },
    invoices: {
      default_account_tax_ids: null;
    },
    payments: {
      statement_descriptor: null,
      statement_descriptor_kana: null,
      statement_descriptor_kanji: null
    },
    payouts: {
      debit_negative_balances: boolean;
      schedule: {
        delay_days: number;
        interval: string;
      };
      statement_descriptor: null;
    },
    sepa_debit_payments: object;
  },
  tos_acceptance: {
    date: null;
    ip: null;
    user_agent: null;
  },
  type: string;
}

// Balance
export interface IBalance {
  amount: number;
  currency: string;
  source_types?: object;
};

export interface IBalanceObject {
  object: string;
  available: IBalance[];
  connect_reserved: IBalance[];
  livemode: boolean;
  pending: IBalance[];
}

// Payout
export interface IPayoutObject {
  id: string;
  object: string;
  amount: number;
  arrival_date: string;
  automatic: boolean;
  balance_transaction: string;
  created: number;
  currency: string;
  description: string;
  destination: string;
  failure_balance_transaction: string;
  failure_code: string;
  failure_message: string;
  livemode: boolean;
  metadata: object;
  method: string;
  original_payout: null;
  reconciliation_status: string;
  reversed_by: null;
  source_type: string;
  statement_descriptor: string;
  status: string;
  type: string;
}

export interface IPayouts {
  object: string;
  data: IPayoutObject[];
  has_more: boolean;
  total_count: number;
  url: string;
}

// Charge
export type PaymentMethodDetails = {
  card: {
    brand: string;
    checks: {
      address_line1_check: null;
      address_postal_code_check: null;
      cvc_check: null;
    };
    country: string;
    exp_month: number;
    exp_year: number;
    fingerprint: string;
    funding: string;
    installments: null;
    last4: string;
    mandate: null;
    network: string;
    three_d_secure: null;
    wallet: null;
  };
  type: string;
};

export interface IChargeObject {
  id: string;
  object: string;
  amount: number;
  amount_captured: number;
  amount_refunded: number;
  application: null;
  application_fee: null;
  application_fee_amount: null;
  balance_transaction: string;
  billing_details: {
    address: {
      city: null;
      country: null;
      line1: null;
      line2: null;
      postal_code: null;
      state: null;
    };
    email: null;
    name: null;
    phone: null;
  };
  calculated_statement_descriptor: string;
  captured: boolean;
  created: number;
  currency: string;
  customer: null;
  description: null;
  disputed: boolean;
  failure_balance_transaction: null;
  failure_code: null;
  failure_message: null;
  fraud_details: object;
  invoice: null;
  livemode: boolean;
  metadata: object;
  on_behalf_of: null;
  outcome: {
    network_status: string;
    reason: null;
    risk_level: string;
    risk_score: number;
    seller_message: string;
    type: string;
  };
  paid: boolean;
  payment_intent: null;
  payment_method: string;
  payment_method_details: PaymentMethodDetails;
  receipt_email: null;
  receipt_number: null;
  receipt_url: string;
  refunded: boolean;
  review: null;
  shipping: null;
  source_transfer: null;
  statement_descriptor: null;
  statement_descriptor_suffix: null;
  status: string;
  transfer_data: null;
  transfer_group: null;
}

export interface ICharges {
  object: string;
  data: IChargeObject[];
  has_more: boolean;
  total_count: number;
  url: string;
}

export class StripeService {
  /**
   * Creates a new Stripe account with basic capabilities
   * @returns Promise<string> The created account ID
   * @throws {Stripe.errors.StripeError}
   */
  static async createStripeAccount(): Promise<string> {
    try {
      const account = await stripe.accounts.create({
        type: "express",
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });
      return account.id;
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw error;
      }
      throw new Error('Failed to create Stripe account');
    }
  }

  /**
   * Retrieves a Stripe account by ID
   * @param accountId The Stripe account ID
   * @returns Promise<Stripe.Account>
   * @throws {Stripe.errors.StripeError}
   */
  static async getStripeAccount(accountId: string): Promise<Stripe.Account> {
    if (!accountId) throw new Error('Account ID is required');
    
    try {
      return await stripe.accounts.retrieve(accountId);
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw error;
      }
      throw new Error(`Failed to retrieve Stripe account: ${accountId}`);
    }
  }

  static async getStripeAccountLink(accountId: string) {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.NEXT_PUBLIC_URL}/np/payment`, 
      return_url: `${process.env.NEXT_PUBLIC_URL}/np/payment`,
      type: "account_onboarding",
    });
    return accountLink;
  }

  static async getStripeAccountPayouts(accountId: string) {
    const payouts = await stripe.payouts.list({
      stripeAccount: accountId,
    });
    return payouts;
  }

  static async deleteStripeAccount(accountId: string) {
    await stripe.accounts.del(accountId);
  }

  static async getNextPayout(accountId: string) {
    const payouts = await stripe.payouts.list({
      stripeAccount: accountId,
    });
    return payouts;
  }

  static async getEarnings(accountId: string) {
    const earnings = await stripe.balance.retrieve({
      stripeAccount: accountId,
    });
    return earnings;
  }

  /**
   * Creates a payment intent
   * @param amount Amount in cents
   * @param accountId Connected account ID
   * @returns Promise<Stripe.PaymentIntent>
   */
  static async createPaymentIntent(
    amount: number, 
    accountId: string
  ): Promise<Stripe.PaymentIntent> {
    if (amount <= 0) throw new Error('Amount must be greater than 0');
    if (!accountId) throw new Error('Account ID is required');

    try {
      return await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        payment_method_types: ["card"],
        transfer_data: {
          destination: accountId,
        },
      });
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw error;
      }
      throw new Error('Failed to create payment intent');
    }
  }

  static async confirmPaymentIntent(paymentIntentId: string) {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
    return paymentIntent;
  }

  // Transfer Methods
  static async createTransfer(amount: number, accountId: string) {
    const transfer = await stripe.transfers.create({
      amount,
      currency: "usd",
      destination: accountId,
    });
    return transfer;
  }

  static async listTransfers(accountId: string) {
    const transfers = await stripe.transfers.list({
      destination: accountId,
    });
    return transfers;
  }

  // Refund Methods
  static async createRefund(paymentIntentId: string) {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });
    return refund;
  }

  // Balance Methods
  static async getAvailableBalance(accountId: string) {
    const balance = await stripe.balance.retrieve({
      stripeAccount: accountId,
    });
    return balance.available;
  }

  // Payout Methods
  static async createPayout(amount: number, accountId: string) {
    const payout = await stripe.payouts.create(
      {
        amount,
        currency: "usd",
      },
      {
        stripeAccount: accountId,
      }
    );
    return payout;
  }

  static async cancelPayout(payoutId: string, accountId: string) {
    const payout = await stripe.payouts.cancel(payoutId, {
      stripeAccount: accountId,
    });
    return payout;
  }

  // Customer Methods
  static async createCustomer(email: string) {
    const customer = await stripe.customers.create({
      email,
    });
    return customer;
  }

  static async attachPaymentMethod(
    customerId: string,
    paymentMethodId: string
  ) {
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
    return paymentMethod;
  }

  // Webhook Handling
  static constructEventFromPayload(
    payload: string,
    signature: string,
    webhookSecret: string
  ) {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }

  // Dispute Handling
  static async listDisputes(accountId: string) {
    const disputes = await stripe.disputes.list({
      stripeAccount: accountId,
    });
    return disputes;
  }

  static async updateDispute(
    disputeId: string,
    accountId: string,
    evidence: Stripe.DisputeUpdateParams
  ) {
    const dispute = await stripe.disputes.update(disputeId, evidence, {
      stripeAccount: accountId,
    });
    return dispute;
  }

  static async closeDispute(disputeId: string, accountId: string) {
    const dispute = await stripe.disputes.close(disputeId, {
      stripeAccount: accountId,
    });
    return dispute;
  }

  // Subscription Methods
  static async createSubscription(
    customerId: string,
    priceId: string,
    accountId: string
  ) {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      transfer_data: {
        destination: accountId,
      },
      application_fee_percent: 10, // Adjust fee percentage as needed
    });
    return subscription;
  }

  static async cancelSubscription(subscriptionId: string) {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return subscription;
  }

  static async updateSubscription(
    subscriptionId: string,
    updateParams: Stripe.SubscriptionUpdateParams
  ) {
    const subscription = await stripe.subscriptions.update(
      subscriptionId,
      updateParams
    );
    return subscription;
  }

  // Product & Price Management
  static async createProduct(
    productData: Stripe.ProductCreateParams,
    accountId: string
  ) {
    const product = await stripe.products.create(productData, {
      stripeAccount: accountId,
    });
    return product;
  }

  static async createPrice(
    priceData: Stripe.PriceCreateParams,
    accountId: string
  ) {
    const price = await stripe.prices.create(priceData, {
      stripeAccount: accountId,
    });
    return price;
  }

  // Account Capabilities
  static async updateAccountCapabilities(
    accountId: string,
    capabilities: Stripe.AccountUpdateParams.Capabilities
  ) {
    const account = await stripe.accounts.update(accountId, {
      capabilities,
    });
    return account;
  }

  static async getPayments(accountId: string) {
    const payments = await stripe.charges.list({
      stripeAccount: accountId,
    });
    return payments;
  }
}
