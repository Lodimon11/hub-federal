// ── Origins & Product Types ─────────────────────────────────────────

export type Origin = "usa" | "spain" | "china";

export type ProductType =
  | "electronics"
  | "clothing"
  | "supplements"
  | "parts"
  | "other";

// ── Quoter ──────────────────────────────────────────────────────────

export interface QuoterInput {
  weight: number;
  productType: ProductType;
  origin: Origin;
  declaredValue: number;
}

export interface BreakdownItem {
  label: string;
  value: number;
  detail?: string;
}

export interface QuoterResult {
  shippingCost: number;
  taxes: number;
  total: number;
  breakdown: BreakdownItem[];
}

// ── Contact ─────────────────────────────────────────────────────────

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

// ── Metrics ─────────────────────────────────────────────────────────

export interface Metric {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
}

// ── Nav ─────────────────────────────────────────────────────────────

export interface NavLink {
  label: string;
  href: string;
}
