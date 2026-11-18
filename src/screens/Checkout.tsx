import { useMemo, useState } from "react";
import { MapPin, AlertTriangle, ArrowLeft } from "lucide-react";
import type { Cart, CostBreakdown, Profile } from "../data/types";
import { fmtRp, budgetStatus } from "../lib/pricing";
import { Button, Modal, Notice, Badge } from "../components/ui";
import { useApp } from "../App";

const ADDRESSES = [
  { label: "Kos dekat kampus, Malang", feeDelta: 0 },
  { label: "Rumah Keluarga — Arjuno, Malang", feeDelta: 4000 },
  { label: "Kantor — Lowokwaru, Malang", feeDelta: 2000 },
];

export default function CheckoutScreen({
  cart,
  profile,
  setProfile,
  breakdown,
  onPaid,
}: {
  cart: Cart;
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  breakdown: CostBreakdown;
  onPaid: (data: { orderId: string; total: number; breakdownJson: string }, newSpentToday: number) => void;
}) {
  const { navigate } = useApp();
  const [addressIdx, setAddressIdx] = useState(0);
  const currentAddress = ADDRESSES[addressIdx];
  const [addressChange, setAddressChange] = useState<null | { before: number; after: number; cause: string }>(null);
  const [exceededDialog, setExceededDialog] = useState(false);
  const [paid, setPaid] = useState(false);

  const addressFee = currentAddress.feeDelta;
  const total = breakdown.total + addressFee;
  const projection = profile.spentToday + total;
  const status = budgetStatus(projection, profile.budget);
  const pct = profile.budget ? Math.round((projection * 100) / profile.budget) : null;
  const empty = cart.lines.length === 0;

  const rows = useMemo(
    () => [
      ["Subtotal item", fmtRp(breakdown.subtotal)],
      ["Pajak restoran", fmtRp(breakdown.tax)],
      ["Biaya kemasan", fmtRp(breakdown.packing)],
      ["Ongkos kirim", fmtRp(breakdown.delivery + addressFee)],
      ["Biaya layanan", fmtRp(breakdown.service)],
      breakdown.foodDiscount > 0 ? ["Diskon voucher makanan", `−${fmtRp(breakdown.foodDiscount)}`] : null,
      breakdown.deliveryDiscount > 0 ? ["Diskon voucher ongkir", `−${fmtRp(breakdown.deliveryDiscount)}`] : null,
    ].filter(Boolean) as [string, string][],
    [breakdown, addressFee]
  );

  const changeAddress = (idx: number) => {
    if (idx === addressIdx) return;
    const before = total;
    const feeDelta = ADDRESSES[idx].feeDelta;
    const after = breakdown.total + feeDelta;
    setAddressIdx(idx);
    setAddressChange({
      before,
      after,
      cause: `perubahan alamat mengubah ongkir sebesar ${fmtRp(Math.abs(after - before))}`,
    });
  };

  const onPay = () => {
    if (status === "EXCEEDED") {
      setExceededDialog(true);
      return;
    }
    doPay();
  };

  const doPay = () => {
    if (paid) return;
    setPaid(true);
    const orderId = "TPBG-" + Date.now().toString(36).toUpperCase();
    onPaid(
      { orderId, total, breakdownJson: JSON.stringify({ rows, total, address: currentAddress.label, exceeded: status === "EXCEEDED" }) },
      profile.spentToday + total
    );
  };

  if (empty) {
    return (
      <div className="mx-auto max-w-md space-y-4 py-10 text-center">
        <h1 className="text-lg font-extrabold text-gray-900">Checkout</h1>
        <Notice>Cart kosong. Tambahkan menu terlebih dahulu.</Notice>
        <Button onClick={() => navigate({ name: "home" })}>Lihat Restoran</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={() => navigate({ name: "cart" })}>
        <ArrowLeft size={18} /> Kembali ke Cart
      </Button>

      <h1 className="text-xl font-extrabold text-gray-900">Checkout</h1>

      {addressChange && (
        <Notice tone="warning">
          Total berubah dari <strong>{fmtRp(addressChange.before)}</strong> menjadi{" "}
          <strong>{fmtRp(addressChange.after)}</strong> karena {addressChange.cause}.
        </Notice>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900">
          <MapPin size={16} className="text-brand-600" /> Alamat Pengiriman
        </h2>
        <ul className="mt-2 space-y-2">
          {ADDRESSES.map((a, i) => (
            <li key={i}>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 px-3 py-2 text-sm has-[:checked]:border-brand-400 has-[:checked]:bg-brand-50">
                <input
                  type="radio"
                  name="address"
                  checked={addressIdx === i}
                  onChange={() => changeAddress(i)}
                  className="h-4 w-4 accent-brand-600"
                />
                <span className="flex-1">
                  {a.label}
                  {a.feeDelta > 0 && (
                    <span className="block text-xs text-gray-500">
                      +{fmtRp(a.feeDelta)} ongkir tambahan
                    </span>
                  )}
                </span>
              </label>
            </li>
          ))}
        </ul>
        {addressFee > 0 && (
          <button
            onClick={() => setProfile((p) => ({ ...p, address: currentAddress.label }))}
            className="mt-2 text-xs font-semibold text-brand-600 underline"
          >
            Simpan sebagai alamat utama
          </button>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900">Rincian Pembayaran</h2>
        <p className="text-xs text-gray-500">
          Total ini sama persis dengan Cart (Delta = Rp0)
        </p>
        <dl className="mt-2 space-y-1 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4">
              <dt className="text-gray-600">{label}</dt>
              <dd className="font-semibold text-gray-900">{value}</dd>
            </div>
          ))}
          <div className="mt-3 flex justify-between border-t border-gray-200 pt-3">
            <dt className="text-base font-extrabold text-gray-900">Total</dt>
            <dd className="text-base font-extrabold text-brand-600">{fmtRp(total)}</dd>
          </div>
        </dl>
      </section>

      {status && pct !== null && profile.budget !== null && (
        <section className="space-y-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">Budget Tracker</h2>
            <Badge status={status} />
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full ${
                status === "OK" ? "bg-green-500" : status === "WARN" ? "bg-amber-500" : "bg-red-600"
              }`}
              style={{ width: `${Math.min(100, pct)}%` }}
            />
          </div>
          <p className="text-xs text-gray-600">
            Proyeksi: {fmtRp(projection)} dari budget {fmtRp(profile.budget)} ({pct}%)
          </p>
        </section>
      )}

      <Button className="w-full" onClick={onPay}>
        Bayar {fmtRp(total)}
      </Button>

      <Modal
        open={exceededDialog}
        onClose={() => setExceededDialog(false)}
        title="Pesanan melebihi budget"
      >
        <div className="space-y-3">
          <div className="flex gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-900">
            <AlertTriangle size={20} className="shrink-0" />
            <p>
              Total <strong>{fmtRp(total)}</strong> melebihi budget harian{" "}
              {fmtRp(profile.budget ?? 0)}. Proyeksi: {fmtRp(projection)} ({pct}%).
            </p>
          </div>
          <div className="grid gap-2">
            <Button variant="secondary" onClick={() => { setExceededDialog(false); navigate({ name: "cart" }); }}>
              Ubah pesanan
            </Button>
            <Button variant="secondary" onClick={() => { setExceededDialog(false); navigate({ name: "home" }); }}>
              Lihat yang sesuai budget
            </Button>
            <Button onClick={() => { setExceededDialog(false); doPay(); }}>
              Lanjutkan tetap
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
