// Stripe price and product configuration
export const STRIPE_PRICES = {
  single: {
    priceId: "price_1SnvipCaAr00JhiPN0Fi3DYD",
    productId: "prod_TlSe1wUh9GFxbP",
    mode: "payment" as const,
  },
  professional: {
    priceId: "price_1Snvj2CaAr00JhiP3fVMOpMi",
    productId: "prod_TlSern59fpwLjO",
    mode: "subscription" as const,
  },
  enterprise: {
    priceId: "price_1SnvjBCaAr00JhiPQCWHnqsb",
    productId: "prod_TlSeuwSiAp2RfV",
    mode: "subscription" as const,
  },
} as const;

export type PlanKey = keyof typeof STRIPE_PRICES;
