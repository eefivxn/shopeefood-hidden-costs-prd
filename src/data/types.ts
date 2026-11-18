export type TaxStatus = "TAXABLE" | "TAX_INCLUDED";

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  desc: string;
  listPrice: number;
  discount: number;
  taxStatus: TaxStatus;
  isSignature: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  category: string;
  distanceKm: number;
  deliveryFee: number;
  serviceFee: number;
  packingFeePerItem: number;
  taxRatePct: number;
  image: string;
}

export type VoucherType = "FOOD" | "DELIVERY";

export interface Voucher {
  id: string;
  name: string;
  type: VoucherType;
  value: number;
  isPercent: boolean;
  maxDiscount: number | null;
  minSubtotal: number;
  restaurantId: string | null;
}

export interface CartLine {
  menuItemId: string;
  qty: number;
}

export interface Cart {
  restaurantId: string | null;
  lines: CartLine[];
  foodVoucherId: string | null;
  deliveryVoucherId: string | null;
}

export type BudgetStatus = "OK" | "WARN" | "EXCEEDED";

export interface CostBreakdown {
  subtotal: number;
  tax: number;
  packing: number;
  delivery: number;
  service: number;
  foodDiscount: number;
  deliveryDiscount: number;
  total: number;
}

export interface Profile {
  budget: number | null;
  spentToday: number;
  address: string;
}
