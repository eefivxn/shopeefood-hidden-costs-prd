import { CheckCircle2 } from "lucide-react";
import type { Profile } from "../data/types";
import { fmtRp } from "../lib/pricing";
import { Button, Notice } from "../components/ui";
import { useApp } from "../App";

export interface ReceiptData {
  orderId: string;
  total: number;
  breakdownJson: string;
}

export default function ReceiptScreen({
  data,
  remaining,
  profile,
}: {
  data: ReceiptData;
  remaining: number | null;
  profile: Profile;
}) {
  const { navigate } = useApp();
  const details = JSON.parse(data.breakdownJson) as {
    rows: [string, string][];
    total: number;
    address: string;
    exceeded: boolean;
  };

  return (
    <div className="mx-auto max-w-md space-y-4 py-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <CheckCircle2 size={48} className="text-green-600" />
        <h1 className="text-xl font-extrabold text-gray-900">Pembayaran Berhasil</h1>
        <p className="text-sm text-gray-600">
          Struk pesanan <span className="font-semibold">{data.orderId}</span>
        </p>
      </div>

      {details.exceeded && (
        <Notice tone="warning">
          Pesanan ini melebihi budget harian dan dicatat sebagai pembayaran yang
          melebihi budget.
        </Notice>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900">Rincian Pembayaran</h2>
        <p className="text-xs text-gray-500">{details.address}</p>
        <dl className="mt-2 space-y-1 text-sm">
          {details.rows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4">
              <dt className="text-gray-600">{label}</dt>
              <dd className="font-semibold text-gray-900">{value}</dd>
            </div>
          ))}
          <div className="mt-3 flex justify-between border-t border-gray-200 pt-3">
            <dt className="text-base font-extrabold text-gray-900">Total</dt>
            <dd className="text-base font-extrabold text-brand-600">{fmtRp(details.total)}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900">Budget Hari Ini</h2>
        <div className="mt-1 space-y-1 text-sm text-gray-700">
          <div className="flex justify-between">
            <span>Budget harian</span>
            <span className="font-semibold">{profile.budget !== null ? fmtRp(profile.budget) : "—"}</span>
          </div>
          <div className="flex justify-between">
            <span>Sisa budget</span>
            <span className={`font-semibold ${remaining !== null && remaining < 0 ? "text-red-600" : "text-green-700"}`}>
              {remaining !== null ? fmtRp(remaining) : "—"}
            </span>
          </div>
        </div>
      </section>

      <Button className="w-full" onClick={() => navigate({ name: "home" })}>
        Kembali ke Beranda
      </Button>
    </div>
  );
}
