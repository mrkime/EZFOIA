// Stripe price and product configuration (LIVE MODE)
export const STRIPE_PRICES = {
  single: {
    monthly: {
      priceId: "price_1StMZfE3t728NStgIJqVSFmf",
      productId: "prod_Tr4jVqNC9t3j8D",
    },
    annual: {
      priceId: "price_1StMZfE3t728NStgIJqVSFmf",
      productId: "prod_Tr4jVqNC9t3j8D",
    },
    mode: "payment" as const,
  },
  professional: {
    monthly: {
      priceId: "price_1StMa2E3t728NStgIqFcVm1c",
      productId: "prod_Tr4jWPLKmaZuju",
    },
    annual: {
      priceId: "price_1StMa8E3t728NStgg8o3xGMA",
      productId: "prod_Tr4j9VnTPhnZN5",
    },
    mode: "subscription" as const,
  },
  enterprise: {
    monthly: {
      priceId: "price_1StMaBE3t728NStgk6UNvPNB",
      productId: "prod_Tr4jIyay9P3qxZ",
    },
    annual: {
      priceId: "price_1StMaCE3t728NStgid7cANb2",
      productId: "prod_Tr4j9U0RvTauTW",
    },
    mode: "subscription" as const,
  },
} as const;

export type PlanKey = keyof typeof STRIPE_PRICES;
export type BillingPeriod = "monthly" | "annual";

// Helper function to get all product IDs for a plan (both monthly and annual)
export const getProductIds = (planKey: PlanKey) => {
  const plan = STRIPE_PRICES[planKey];
  return {
    monthly: plan.monthly.productId,
    annual: plan.annual.productId,
  };
};

// Helper to check if a product ID matches any billing period of a plan
export const matchesPlan = (productId: string | null, planKey: PlanKey): boolean => {
  if (!productId) return false;
  const ids = getProductIds(planKey);
  return productId === ids.monthly || productId === ids.annual;
};
