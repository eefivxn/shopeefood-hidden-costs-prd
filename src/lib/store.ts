import { useEffect, useState, useCallback } from "react";
import type { Cart, Profile } from "../data/types";
import { WIRA_DEFAULT } from "../data/mockData";

const LS_PROFILE = "tpbg_profile";
const LS_CART = "tpbg_cart";
const LS_TOAST = "tpbg_pending_home_filter";

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

export const defaultProfile: Profile = {
  budget: WIRA_DEFAULT.budget,
  spentToday: WIRA_DEFAULT.spentToday,
  address: WIRA_DEFAULT.address,
};

export const emptyCart: Cart = {
  restaurantId: null,
  lines: [],
  foodVoucherId: null,
  deliveryVoucherId: null,
};

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(() =>
    load(LS_PROFILE, defaultProfile)
  );
  useEffect(() => save(LS_PROFILE, profile), [profile]);
  const resetProfile = useCallback(
    () => setProfile({ ...defaultProfile }),
    []
  );
  return { profile, setProfile, resetProfile };
}

export function useCart() {
  const [cart, setCart] = useState<Cart>(() => load(LS_CART, emptyCart));
  useEffect(() => save(LS_CART, cart), [cart]);
  return [cart, setCart] as const;
}

export function setPendingHomeFilter(v: boolean) {
  save(LS_TOAST, v);
}
export function consumePendingHomeFilter(): boolean {
  const v = load(LS_TOAST, false);
  save(LS_TOAST, false);
  return v;
}
