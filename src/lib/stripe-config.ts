// Stripe price and product configuration
export const STRIPE_PRICES = {
  single: {
    monthly: {
      priceId: "price_1SnvipCaAr00JhiPN0Fi3DYD",
      productId: "prod_TlSe1wUh9GFxbP",
    },
    annual: {
      priceId: "price_1SnvipCaAr00JhiPN0Fi3DYD",
      productId: "prod_TlSe1wUh9GFxbP",
    },
    mode: "payment" as const,
  },
  professional: {
    monthly: {
      priceId: "price_1Snvj2CaAr00JhiP3fVMOpMi",
      productId: "prod_TlSern59fpwLjO",
    },
    annual: {
      priceId: "price_1Snzs4CaAr00JhiPrsLrntT1",
      productId: "prod_TlWvRFd8ZtAKBp",
    },
    mode: "subscription" as const,
  },
  enterprise: {
    monthly: {
      priceId: "price_1SnvjBCaAr00JhiPQCWHnqsb",
      productId: "prod_TlSeuwSiAp2RfV",
    },
    annual: {
      priceId: "price_1SnzsECaAr00JhiPPlOSKJgB",
      productId: "prod_TlWwKoQlAM8g1G",
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
