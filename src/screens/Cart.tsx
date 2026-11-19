import { useState } from "react";
import { Minus, Plus, Ticket, Trash2, ChevronLeft } from "lucide-react";
import type { Cart, CostBreakdown, Profile, Voucher } from "../data/types";
import { VOUCHERS, menuById, restaurantById } from "../data/mockData";
import { fmtRp, budgetStatus, budgetTenths, fmtPctTenths, voucherEligibility } from "../lib/pricing";
import { Button, Modal, Notice, Badge } from "../components/ui";
import { useApp } from "../App";

export default function CartScreen({
  cart,
  setCart,
  profile,
  breakdown,
  cartNotice,
  setCartNotice,
}: {
  cart: Cart;
  setCart: React.Dispatch<React.SetStateAction<Cart>>;
  profile: Profile;
  breakdown: CostBreakdown;
  cartNotice: string | null;
  setCartNotice: (v: string | null) => void;
}) {
  const { navigate } = useApp();
  const [voucherModal, setVoucherModal] = useState<null | "FOOD" | "DELIVERY">(null);
  const restaurant = restaurantById(cart.restaurantId);
  const isEmpty = cart.lines.length === 0;
  const projection = profile.spentToday + breakdown.total;
  const status = budgetStatus(projection, profile.budget);
  const pct = profile.budget ? budgetTenths(projection, profile.budget) : null;
  const pctLabel = pct !== null ? fmtPctTenths(pct) : null;

  const subtotal = breakdown.subtotal;

  const voucherRow = (v: Voucher) => {
    const { eligible, reason } = voucherEligibility(v, cart.restaurantId, subtotal);
    const active =
      v.type === "FOOD" ? cart.foodVoucherId === v.id : cart.deliveryVoucherId === v.id;
    return { v, eligible, reason, active };
  };

  const pickVoucher = (v: Voucher) => {
    setCart((c) => ({
      ...c,
      foodVoucherId: v.type === "FOOD" ? v.id : c.foodVoucherId,
      deliveryVoucherId: v.type === "DELIVERY" ? v.id : c.deliveryVoucherId,
    }));
    setVoucherModal(null);
    setCartNotice(null);
  };

  const removeVoucher = (type: "FOOD" | "DELIVERY") => {
    setCart((c) => ({
      ...c,
      foodVoucherId: type === "FOOD" ? null : c.foodVoucherId,
      deliveryVoucherId: type === "DELIVERY" ? null : c.deliveryVoucherId,
    }));
  };

  const applyQty = (menuItemId: string, delta: number) => {
    setCartNotice(null);
    setCart((c) => {
      const lines = [...c.lines];
      const idx = lines.findIndex((l) => l.menuItemId === menuItemId);
      if (idx === -1) return c;
      const newQty = lines[idx].qty + delta;
      if (newQty <= 0) lines.splice(idx, 1);
      else lines[idx] = { ...lines[idx], qty: newQty };

      const subtotal = lines.reduce((sum, l) => {
        const m = menuById(l.menuItemId);
        return m ? sum + (m.listPrice - m.discount) * l.qty : sum;
      }, 0);

      const stillEligible = (vid: string | null) => {
        if (!vid) return null;
        const v = VOUCHERS.find((x) => x.id === vid);
        if (!v) return null;
        return voucherEligibility(v, c.restaurantId, subtotal).eligible ? vid : null;
      };

      const newFood = stillEligible(c.foodVoucherId);
      const newDel = stillEligible(c.deliveryVoucherId);
      if (c.foodVoucherId && !newFood) {
        setCartNotice(`Voucher makanan dilepas otomatis karena subtotal di bawah minimum.`);
      }
      if (c.deliveryVoucherId && !newDel) {
        setCartNotice(`Voucher ongkir dilepas otomatis karena subtotal di bawah minimum.`);
      }
      return { ...c, lines, foodVoucherId: newFood, deliveryVoucherId: newDel };
    });
  };

  if (isEmpty) {
    return (
      <div className="mx-auto max-w-md space-y-4 py-10 text-center">
        <div className="text-5xl">🛒</div>
        <h1 className="text-lg font-extrabold text-gray-900">Cart kamu kosong</h1>
        <p className="text-sm text-gray-600">
          Tambahkan menu dari salah satu restoran untuk mulai memesan.
        </p>
        <Button onClick={() => navigate({ name: "home" })}>Lihat Restoran</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => navigate({ name: "home" })}>
          <ChevronLeft size={18} /> Kembali
        </Button>
      </div>

      <h1 className="text-xl font-extrabold text-gray-900">
        Cart — {restaurant?.name}
      </h1>

      {cartNotice && <Notice tone="warning">{cartNotice}</Notice>}

      <section className="space-y-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        {cart.lines.map((line) => {
          const m = menuById(line.menuItemId);
          if (!m) return null;
          const net = m.listPrice - m.discount;
          return (
            <div key={line.menuItemId} className="flex items-center justify-between gap-3 py-1">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">{m.name}</p>
                <p className="text-xs text-gray-500">
                  {fmtRp(net)} × {line.qty}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-1">
                  <button onClick={() => applyQty(line.menuItemId, -1)} aria-label={`Kurangi ${m.name}`} className="p-1 text-gray-600 hover:text-gray-900">
                    <Minus size={14} />
                  </button>
                  <span className="min-w-6 text-center text-sm font-semibold">{line.qty}</span>
                  <button onClick={() => applyQty(line.menuItemId, 1)} aria-label={`Tambah ${m.name}`} className="p-1 text-gray-600 hover:text-gray-900">
                    <Plus size={14} />
                  </button>
                </div>
                <span className="w-20 text-right text-sm font-bold text-gray-900">
                  {fmtRp(net * line.qty)}
                </span>
                <button
                  onClick={() => applyQty(line.menuItemId, -line.qty)}
                  aria-label={`Hapus ${m.name}`}
                  className="rounded p-1 text-gray-400 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </section>

      <section className="space-y-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900">
          <Ticket size={16} className="text-brand-600" /> Voucher
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" className="text-xs" onClick={() => setVoucherModal("FOOD")}>
            {cart.foodVoucherId ? `Voucher Makanan: ${VOUCHERS.find((v) => v.id === cart.foodVoucherId)?.name}` : "Pilih Voucher Makanan"}
          </Button>
          <Button variant="secondary" className="text-xs" onClick={() => setVoucherModal("DELIVERY")}>
            {cart.deliveryVoucherId ? `Voucher Ongkir: ${VOUCHERS.find((v) => v.id === cart.deliveryVoucherId)?.name}` : "Pilih Voucher Ongkir"}
          </Button>
        </div>
        {(cart.foodVoucherId || cart.deliveryVoucherId) && (
          <button
            onClick={() => {
              if (cart.foodVoucherId) removeVoucher("FOOD");
              if (cart.deliveryVoucherId) removeVoucher("DELIVERY");
            }}
            className="text-xs font-semibold text-gray-500 underline hover:text-red-600"
          >
            Lepas semua voucher
          </button>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900">Rincian Biaya</h2>
        <dl className="mt-2 space-y-1 text-sm">
          <Row label="Subtotal item" value={fmtRp(breakdown.subtotal)} />
          <Row label="Pajak restoran" value={fmtRp(breakdown.tax)} />
          <Row label="Biaya kemasan" value={fmtRp(breakdown.packing)} />
          <Row label="Ongkos kirim" value={fmtRp(breakdown.delivery)} />
          <Row label="Biaya layanan" value={fmtRp(breakdown.service)} />
          {breakdown.foodDiscount > 0 && (
            <Row label="Diskon voucher makanan" value={`−${fmtRp(breakdown.foodDiscount)}`} accent="text-green-700" />
          )}
          {breakdown.deliveryDiscount > 0 && (
            <Row label="Diskon voucher ongkir" value={`−${fmtRp(breakdown.deliveryDiscount)}`} accent="text-green-700" />
          )}
          <div className="!mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
            <dt className="text-base font-extrabold text-gray-900">Total</dt>
            <dd className="text-base font-extrabold text-brand-600">{fmtRp(breakdown.total)}</dd>
          </div>
        </dl>
      </section>

      {status && pct !== null && pctLabel !== null && profile.budget !== null && (
        <section className="space-y-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">Budget Tracker</h2>
            <Badge status={status} />
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100" role="progressbar" aria-valuenow={Math.round(pct / 10)} aria-valuemin={0} aria-valuemax={100}>
            <div
              className={`h-full rounded-full transition-all ${
                status === "OK" ? "bg-green-500" : status === "WARN" ? "bg-amber-500" : "bg-red-600"
              }`}
              style={{ width: `${Math.min(100, pct / 10)}%` }}
            />
          </div>
          <p className="text-xs text-gray-600">
            Proyeksi: {fmtRp(projection)} dari budget {fmtRp(profile.budget)} ({pctLabel})
          </p>
          {status === "EXCEEDED" && projection > profile.budget && (
            <p className="text-xs font-semibold text-red-700">
              Melebihi budget {fmtRp(projection - profile.budget)}
            </p>
          )}
        </section>
      )}

      <Button
        className="w-full"
        disabled={isEmpty}
        onClick={() => navigate({ name: "checkout" })}
      >
        Lanjut ke Checkout
      </Button>

      <Modal open={voucherModal !== null} onClose={() => setVoucherModal(null)} title={voucherModal === "FOOD" ? "Voucher Makanan" : "Voucher Ongkir"}>
        <ul className="space-y-2">
          {VOUCHERS.filter((v) => v.type === voucherModal).map((v) => {
            const { eligible, reason, active } = voucherRow(v);
            return (
              <li
                key={v.id}
                className={`rounded-xl border p-3 text-sm ${
                  active ? "border-brand-400 bg-brand-50" : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-gray-900">{v.name}</p>
                    <p className="text-xs text-gray-500">
                      {v.isPercent ? `Diskon ${v.value}% (maks ${fmtRp(v.maxDiscount ?? 0)})` : `Potongan ${fmtRp(v.value)}`} • Min. belanja {fmtRp(v.minSubtotal)}
                      {v.restaurantId ? ` • Hanya ${v.restaurantId}` : ""}
                    </p>
                  </div>
                  <Button
                    className="!px-3 !py-1 text-xs"
                    variant={active ? "secondary" : "primary"}
                    disabled={!eligible}
                    onClick={() => pickVoucher(v)}
                  >
                    {active ? "Terpasang" : eligible ? "Pakai" : "Tidak bisa"}
                  </Button>
                </div>
                {!eligible && reason && (
                  <p className="mt-1 text-xs text-red-600">{reason}</p>
                )}
              </li>
            );
          })}
        </ul>
      </Modal>
    </div>
  );
}

function Row({ label, value, accent = "" }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-gray-600">{label}</dt>
      <dd className={`font-semibold ${accent || "text-gray-900"}`}>{value}</dd>
    </div>
  );
}
