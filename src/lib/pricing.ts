import { restaurantById, menuById, VOUCHERS, MENU } from "../data/mockData";

const RESTAURANT_NAMES: Record<string, string> = {
  "R-01": "Ayam Bakar Pak Dhe",
  "R-02": "Geprek Bu Rina",
  "R-03": "Nasi Goreng Mas Joko",
  "R-04": "Bakso Pak Slamet",
  "R-05": "Kopi & Roti Senja",
  "R-06": "Sate Ayam Madura",
};
import type {
  BudgetStatus,
  Cart,
  CostBreakdown,
  Voucher,
} from "../data/types";

export const fmtRp = (n: number): string => {
  if (!Number.isInteger(n)) n = Math.round(n);
  const sign = n < 0 ? "-" : "";
  const digits = Math.abs(n).toString();
  let grouped = "";
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 === 0) grouped += ".";
    grouped += digits[i];
  }
  return `${sign}Rp${grouped}`;
};

// BR-09/BR-11: percentage with one decimal, comma separator, no rounding of status input.
// tenths = round half up of projection*1000/budget, integer-only.
export const budgetTenths = (projection: number, budget: number): number =>
  budget <= 0 ? 0 : Math.floor((projection * 2000 + budget) / (2 * budget));

export const fmtPctTenths = (tenths: number): string =>
  tenths % 10 === 0 ? `${tenths / 10}%` : `${Math.floor(tenths / 10)},${tenths % 10}%`;

export const roundHalfUp = (base: number, pct: number): number =>
  Math.floor((base * pct + 50) / 100);

export const pctDiscount = (base: number, pct: number): number =>
  Math.floor((base * pct) / 100);

export const netPrice = (menuItemId: string): number => {
  const m = menuById(menuItemId);
  if (!m) return 0;
  return m.listPrice - m.discount;
};

export const itemAllInEstimate = (menuItemId: string): number | null => {
  const m = menuById(menuItemId);
  if (!m) return null;
  const r = restaurantById(m.restaurantId);
  if (!r) return null;
  const subtotal = netPrice(m.id);
  const tax =
    m.taxStatus === "TAXABLE" ? roundHalfUp(subtotal, r.taxRatePct) : 0;
  const packing = r.packingFeePerItem;
  return subtotal + tax + packing + r.deliveryFee + r.serviceFee;
};

export const restaurantAllInEstimate = (restaurantId: string): number | null => {
  const signature = MENU.find(
    (m) => m.restaurantId === restaurantId && m.isSignature
  );
  if (!signature) return null;
  return itemAllInEstimate(signature.id);
};

export const voucherById = (id: string | null): Voucher | null =>
  id ? VOUCHERS.find((v) => v.id === id) ?? null : null;

export const voucherEligibility = (
  voucher: Voucher,
  restaurantId: string | null,
  subtotal: number
): { eligible: boolean; reason: string | null; shortfall: number } => {
  if (voucher.restaurantId && voucher.restaurantId !== restaurantId) {
    const target = RESTAURANT_NAMES[voucher.restaurantId] ?? voucher.restaurantId;
    return {
      eligible: false,
      reason: `Hanya berlaku di ${target}`,
      shortfall: 0,
    };
  }
  if (subtotal < voucher.minSubtotal) {
    const shortfall = voucher.minSubtotal - subtotal;
    return {
      eligible: false,
      reason: `kurang ${fmtRp(shortfall)} dari minimum belanja ${fmtRp(voucher.minSubtotal)}`,
      shortfall,
    };
  }
  return { eligible: true, reason: null, shortfall: 0 };
};

export const calculate = (
  cart: Cart,
  deliveryFeeAdjustment = 0
): CostBreakdown => {
  const r = restaurantById(cart.restaurantId);
  const empty: CostBreakdown = {
    subtotal: 0,
    tax: 0,
    packing: 0,
    delivery: 0,
    service: 0,
    foodDiscount: 0,
    deliveryDiscount: 0,
    total: 0,
  };
  if (!r || cart.lines.length === 0) return empty;

  let subtotal = 0;
  let taxableBase = 0;
  let totalQty = 0;
  for (const line of cart.lines) {
    const m = menuById(line.menuItemId);
    if (!m || line.qty <= 0) continue;
    const net = netPrice(m.id);
    subtotal += net * line.qty;
    if (m.taxStatus === "TAXABLE") taxableBase += net * line.qty;
    totalQty += line.qty;
  }

  const tax = roundHalfUp(taxableBase, r.taxRatePct);
  const packing = totalQty * r.packingFeePerItem;
  const delivery = r.deliveryFee + deliveryFeeAdjustment;
  const service = r.serviceFee;

  const fv = voucherById(cart.foodVoucherId);
  let foodDiscount = 0;
  if (fv) {
    const { eligible } = voucherEligibility(fv, cart.restaurantId, subtotal);
    if (eligible) {
      const raw = fv.isPercent
        ? pctDiscount(subtotal, fv.value)
        : fv.value;
      const capped =
        fv.maxDiscount !== null ? Math.min(raw, fv.maxDiscount) : raw;
      foodDiscount = Math.min(capped, subtotal);
    }
  }

  const dv = voucherById(cart.deliveryVoucherId);
  let deliveryDiscount = 0;
  if (dv) {
    const { eligible } = voucherEligibility(dv, cart.restaurantId, subtotal);
    if (eligible) {
      const raw = dv.isPercent ? pctDiscount(delivery, dv.value) : dv.value;
      const capped =
        dv.maxDiscount !== null ? Math.min(raw, dv.maxDiscount) : raw;
      deliveryDiscount = Math.min(capped, delivery);
    }
  }

  const total = Math.max(
    0,
    subtotal +
      tax +
      packing +
      delivery +
      service -
      foodDiscount -
      deliveryDiscount
  );

  return {
    subtotal,
    tax,
    packing,
    delivery,
    service,
    foodDiscount,
    deliveryDiscount,
    total,
  };
};

export const budgetStatus = (
  projection: number,
  budget: number | null
): BudgetStatus | null => {
  if (budget === null || budget === undefined) return null;
  if (projection * 100 < budget * 80) return "OK";
  if (projection <= budget) return "WARN";
  return "EXCEEDED";
};

export const budgetProjectionPct = (
  projection: number,
  budget: number | null
): number | null => {
  if (!budget) return null;
  return budgetTenths(projection, budget) / 10;
};
