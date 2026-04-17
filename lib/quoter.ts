import type { Origin, ProductType, QuoterInput, QuoterResult } from "@/types";

// ── Pricing Configuration ───────────────────────────────────────────
// These values are documented in the implementation plan.

const BASE_PRICE_PER_KG = 12; // USD per kg
const MINIMUM_SHIPPING = 35; // USD minimum
const FRANCHISE_LIMIT = 400; // USD free of taxes
const TAX_RATE_OVER_FRANCHISE = 0.5; // 50% over franchise excess

/** Multiplier applied based on product type (handling, insurance, customs). */
const PRODUCT_MULTIPLIERS: Record<ProductType, number> = {
  electronics: 1.3,
  clothing: 1.0,
  supplements: 1.2,
  parts: 1.4,
  other: 1.1,
};

/** Surcharge applied based on origin route. */
const ORIGIN_SURCHARGES: Record<Origin, number> = {
  usa: 0.0,
  spain: 0.15,
  china: 0.25,
};

// ── Labels ──────────────────────────────────────────────────────────

export const PRODUCT_LABELS: Record<ProductType, string> = {
  electronics: "Electrónica",
  clothing: "Ropa / Textil",
  supplements: "Suplementos",
  parts: "Repuestos / Autopartes",
  other: "Otros",
};

export const ORIGIN_LABELS: Record<Origin, string> = {
  usa: "Estados Unidos",
  spain: "España",
  china: "China",
};

// ── Calculator ──────────────────────────────────────────────────────

/**
 * Calculates the estimated shipping cost for an international courier shipment.
 *
 * Formula:
 *   shippingCost = max(weight × basePrice × productMultiplier × (1 + originSurcharge), minimum)
 *   taxes = max((declaredValue - franchiseLimit) × taxRate, 0)
 *   total = shippingCost + taxes
 */
export function calculateQuote(input: QuoterInput): QuoterResult {
  const { weight, productType, origin, declaredValue } = input;

  const productMultiplier = PRODUCT_MULTIPLIERS[productType];
  const originSurcharge = ORIGIN_SURCHARGES[origin];

  // Base shipping calculation
  const rawShipping =
    weight * BASE_PRICE_PER_KG * productMultiplier * (1 + originSurcharge);
  const shippingCost = Math.max(rawShipping, MINIMUM_SHIPPING);

  // Tax calculation (only over franchise limit)
  const franchiseExcess = Math.max(declaredValue - FRANCHISE_LIMIT, 0);
  const taxes = franchiseExcess * TAX_RATE_OVER_FRANCHISE;

  const total = shippingCost + taxes;

  // Build a detailed breakdown for the UI
  const breakdown = [
    {
      label: "Costo base de envío",
      value: weight * BASE_PRICE_PER_KG,
      detail: `${weight} kg × USD ${BASE_PRICE_PER_KG}/kg`,
    },
    {
      label: `Multiplicador (${PRODUCT_LABELS[productType]})`,
      value: rawShipping - weight * BASE_PRICE_PER_KG * (1 + originSurcharge),
      detail: `×${productMultiplier}`,
    },
    {
      label: `Recargo origen (${ORIGIN_LABELS[origin]})`,
      value:
        weight * BASE_PRICE_PER_KG * productMultiplier * originSurcharge,
      detail: `+${(originSurcharge * 100).toFixed(0)}%`,
    },
  ];

  if (shippingCost > rawShipping) {
    breakdown.push({
      label: "Ajuste mínimo de envío",
      value: shippingCost - rawShipping,
      detail: `Mínimo USD ${MINIMUM_SHIPPING}`,
    });
  }

  if (taxes > 0) {
    breakdown.push({
      label: "Impuestos estimados",
      value: taxes,
      detail: `(USD ${declaredValue} − USD ${FRANCHISE_LIMIT}) × ${(TAX_RATE_OVER_FRANCHISE * 100).toFixed(0)}%`,
    });
  }

  return {
    shippingCost: Math.round(shippingCost * 100) / 100,
    taxes: Math.round(taxes * 100) / 100,
    total: Math.round(total * 100) / 100,
    breakdown,
  };
}
